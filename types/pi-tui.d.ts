declare module "@mariozechner/pi-tui" {
	export interface Component {
		render(width: number): string[];
		invalidate(): void;
		handleInput?(data: string): void;
		wantsKeyRelease?: boolean;
	}

	export class Text implements Component {
		constructor(text?: string, paddingX?: number, paddingY?: number, customBgFn?: (text: string) => string);
		setText(text: string): void;
		setCustomBgFn(customBgFn?: (text: string) => string): void;
		invalidate(): void;
		render(width: number): string[];
	}
}
