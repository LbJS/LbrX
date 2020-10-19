
export function mockWindow(): void {
  globalThis.window = globalThis as any
}

export function deleteMockedWindow(): void {
  delete (globalThis as any).window
}
