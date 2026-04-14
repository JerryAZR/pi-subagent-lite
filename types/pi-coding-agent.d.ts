declare module "@mariozechner/pi-coding-agent" {
	export interface AgentToolResult {
		content: Array<{ type: "text"; text: string }>;
		isError?: boolean;
	}

	export interface ToolContext {
		cwd: string;
		hasUI: boolean;
	}

	export interface ExtensionAPI {
		registerTool(tool: {
			name: string;
			label: string;
			description: string;
			promptSnippet?: string;
			promptGuidelines?: string[];
			parameters: unknown;
			execute(
				toolCallId: string,
				params: any,
				signal: AbortSignal | undefined,
				onUpdate: ((result: AgentToolResult) => void) | undefined,
				ctx: ToolContext,
			): Promise<AgentToolResult>;
		}): void;
	}
}
