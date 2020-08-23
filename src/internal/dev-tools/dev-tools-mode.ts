
let isDevToolsMode = false

export function isDevTools(): boolean {
  return isDevToolsMode
}

export function activateStreamToDevTools(): void {
  isDevToolsMode = true
}
