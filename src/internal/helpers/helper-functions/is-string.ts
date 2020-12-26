
export function isString<T = string>(value: any): value is T {
  return typeof value == `string`
}
