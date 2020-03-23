
let isDevToolsMode = false

export function isDevTools(): boolean {
	return isDevToolsMode
}

export function activateDevToolsPushes(): void {
	isDevToolsMode = true
}
