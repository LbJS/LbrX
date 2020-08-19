
export function logError(error: Error): void
export function logError(message: string): void
export function logError(message: string, error: Error): void
export function logError(errorOrMessage: string | Error, error?: Error): void {
  error ? console.error(errorOrMessage, error) : console.error(errorOrMessage)
}
