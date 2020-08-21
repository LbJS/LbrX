
let _isStackTracingErrors = false

export function isStackTracingErrors(): boolean {
  return _isStackTracingErrors
}

export function enableStackTracingErrors(): void {
  _isStackTracingErrors = true
}
