
export function throwError(error?: Error): never
export function throwError(message?: string): never
export function throwError(errorOrMessage?: Error | string): never {
  throw new Error(errorOrMessage as string)
}
