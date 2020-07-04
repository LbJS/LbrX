
export function isObject<T = object>(value: any): value is T {
  return value && typeof value == 'object'
}
