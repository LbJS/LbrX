
export function stringify(
  value: any,
  replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
  space?: string | number
): string {
  return JSON.stringify(value, replacer, space)
}
