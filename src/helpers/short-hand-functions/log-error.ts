
export function logError(error: Error): void
// tslint:disable-next-line: unified-signatures
export function logError(message: string): void
// tslint:disable-next-line: unified-signatures
export function logError(message: string, error: Error): void
export function logError(errorOrMessage: string | Error, error?: Error): void {
	error ? console.error(errorOrMessage, error) : console.error(errorOrMessage)
}
