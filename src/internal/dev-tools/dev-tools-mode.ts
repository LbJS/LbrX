
let isDevToolsMode = false

export function isDevTools(): boolean {
  return isDevToolsMode
}

export function activateDevToolsStream(): void {
  isDevToolsMode = true
}
