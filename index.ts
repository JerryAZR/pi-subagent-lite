/**
 * Minimal subagent extension
 *
 * Delegates a task to a fresh pi process with an isolated context window.
 * Optionally loads startup skills via --skill flags.
 */

import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { Message } from "@mariozechner/pi-ai";
import { type ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

const MINIMAL_SYSTEM_PROMPT = `You are a subagent running in an isolated pi process with access to file system and shell tools.

Your job is to focus exclusively on the assigned task, use tools as needed, and provide a clear, concise report or summary at the end.

Guidelines:
- Stay focused on the task. Do not drift into unrelated work.
- Be concise, but include enough detail for the parent agent to act on your findings.
- End with a clear summary or conclusion.`;

function getPiInvocation(args: string[]): { command: string; args: string[] } {
	const currentScript = process.argv[1];
	if (currentScript && fs.existsSync(currentScript)) {
		return { command: process.execPath, args: [currentScript, ...args] };
	}
	const execName = path.basename(process.execPath).toLowerCase();
	const isGenericRuntime = /^(node|bun)(\.exe)?$/.test(execName);
	if (!isGenericRuntime) {
		return { command: process.execPath, args };
	}
	return { command: "pi", args };
}

async function runSubagent(
	cwd: string,
	task: string,
	skills: string[],
	signal?: AbortSignal,
): Promise<string> {
	const args: string[] = ["--mode", "json", "-p", "--no-session"];

	for (const skill of skills) {
		args.push("--skill", skill);
	}

	let tmpFile: string | null = null;

	try {
		const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "pi-subagent-"));
		tmpFile = path.join(tmpDir, "prompt.md");
		await fs.promises.writeFile(tmpFile, MINIMAL_SYSTEM_PROMPT, { encoding: "utf-8", mode: 0o600 });
		args.push("--append-system-prompt", tmpFile);

		args.push(`Task: ${task}`);

		const invocation = getPiInvocation(args);
		const proc = spawn(invocation.command, invocation.args, {
			cwd,
			shell: false,
			stdio: ["ignore", "pipe", "pipe"],
		});

		let buffer = "";
		let stderr = "";
		const messages: Message[] = [];

		const processLine = (line: string) => {
			if (!line.trim()) return;
			let event: any;
			try {
				event = JSON.parse(line);
			} catch {
				return;
			}
			if (event.type === "message_end" && event.message) {
				messages.push(event.message as Message);
			}
		};

		proc.stdout.on("data", (data) => {
			buffer += data.toString();
			const lines = buffer.split("\n");
			buffer = lines.pop() || "";
			for (const line of lines) processLine(line);
		});

		proc.stderr.on("data", (data) => {
			stderr += data.toString();
		});

		const exitCode = await new Promise<number>((resolve) => {
			const onAbort = () => {
				proc.kill("SIGTERM");
				setTimeout(() => {
					if (!proc.killed) proc.kill("SIGKILL");
				}, 5000);
			};

			if (signal?.aborted) {
				onAbort();
			} else {
				signal?.addEventListener("abort", onAbort, { once: true });
			}

			proc.on("close", (code) => {
				signal?.removeEventListener("abort", onAbort);
				if (buffer.trim()) processLine(buffer);
				resolve(code ?? 0);
			});
			proc.on("error", () => {
				signal?.removeEventListener("abort", onAbort);
				resolve(1);
			});
		});

		if (signal?.aborted) throw new Error("Subagent aborted");

		if (exitCode !== 0) {
			throw new Error(stderr || `Subagent exited with code ${exitCode}`);
		}

		for (let i = messages.length - 1; i >= 0; i--) {
			const msg = messages[i];
			if (msg.role === "assistant") {
				for (const part of msg.content) {
					if (part.type === "text") return part.text ?? "";
				}
			}
		}

		return "";
	} finally {
		if (tmpFile) {
			try {
				await fs.promises.unlink(tmpFile);
				await fs.promises.rmdir(path.dirname(tmpFile));
			} catch {
				/* ignore */
			}
		}
	}
}

const SubagentParams = Type.Object({
	task: Type.String({ description: "Task to delegate to the subagent" }),
	skills: Type.Optional(
		Type.Array(Type.String({ description: "Skill path or name to load via --skill" }), {
			description: "Optional startup skills to load into the subagent process",
		}),
	),
});

export default function (pi: ExtensionAPI) {
	pi.registerTool({
		name: "subagent",
		label: "Subagent",
		description: "Delegate tasks to fresh pi subagents with isolated context windows. You may invoke multiple subagents in parallel via separate tool calls. Each subagent returns a concise summary or report when its work is done. Optional startup skills can be preloaded.",
		promptSnippet: "Delegate a task to an isolated subagent process",
		promptGuidelines: [
			"Delegate non-trivial, self-contained tasks to subagents so you can stay focused on the overall picture.",
		],
		parameters: SubagentParams,

		async execute(_toolCallId, params, signal, _onUpdate, ctx) {
			try {
				const output = await runSubagent(ctx.cwd, params.task, params.skills ?? [], signal);
				return {
					content: [{ type: "text", text: output || "(no output)" }],
				};
			} catch (err: any) {
				return {
					content: [{ type: "text", text: err.message || String(err) }],
					isError: true,
				};
			}
		},
	});
}
