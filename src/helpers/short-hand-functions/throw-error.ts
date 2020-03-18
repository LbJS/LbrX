
export function throwError(error?: Error): never
// tslint:disable-next-line: unified-signatures
export function throwError(message?: string): never
export function throwError(errorOrMessage?: Error | string): never {
	throw new Error(errorOrMessage as string)
}
