declare module "@mariozechner/pi-coding-agent" {
	export interface AgentToolResult<TDetails = unknown> {
		content: Array<{ type: "text"; text: string }>;
		isError?: boolean;
		details?: TDetails;
	}

	export type AgentToolUpdateCallback<TDetails = unknown> = (result: AgentToolResult<TDetails>) => void;

	export interface ToolRenderResultOptions {
		expanded: boolean;
		isPartial: boolean;
	}

	export interface ToolRenderContext {
		args: any;
		toolCallId: string;
		invalidate: () => void;
		lastComponent: import("@mariozechner/pi-tui").Component | undefined;
		state: any;
		cwd: string;
		executionStarted: boolean;
		argsComplete: boolean;
		isPartial: boolean;
		expanded: boolean;
		showImages: boolean;
		isError: boolean;
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
				onUpdate: AgentToolUpdateCallback | undefined,
				ctx: ToolContext,
			): Promise<AgentToolResult>;
			renderCall?: (args: any, theme: any, context: ToolRenderContext) => import("@mariozechner/pi-tui").Component;
			renderResult?: (result: AgentToolResult, options: ToolRenderResultOptions, theme: any, context: ToolRenderContext) => import("@mariozechner/pi-tui").Component;
		}): void;
	}
}
