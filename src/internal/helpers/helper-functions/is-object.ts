
export function isObject<T extends object = object>(value: any): value is T {
  return value && typeof value == 'object'
}
