
export function isError(value: any): value is Error
export function isError<T>(value: any): value is T
export function isError<T>(value: any): value is Error | T {
  return value instanceof Error
}
