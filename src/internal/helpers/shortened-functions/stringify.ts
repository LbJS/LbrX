
export function stringify(
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): string
export function stringify(
  value: any,
  replacer?: (number | string)[] | null,
  space?: string | number
): string
export function stringify(
  value: any,
  replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null,
  space?: string | number
): string {
  return JSON.stringify(value, replacer as any, space)
}
