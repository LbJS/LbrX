
export function isArray<T = any>(value: any): value is T[] {
  return Array.isArray(value)
}
