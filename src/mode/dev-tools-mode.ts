
let isDevToolsMode = false

export function isDevTools(): boolean {
	return isDevToolsMode
}

export function enableDevToolsUpdates(): void {
	isDevToolsMode = true
}
