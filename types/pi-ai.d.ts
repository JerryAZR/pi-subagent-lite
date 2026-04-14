declare module "@mariozechner/pi-ai" {
	export interface Message {
		role: string;
		content: Array<{ type: string; text?: string }>;
	}
}
