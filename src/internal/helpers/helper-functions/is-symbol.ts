
export function isSymbol<T = symbol>(value: T): value is T {
  return typeof value == `symbol`
}
