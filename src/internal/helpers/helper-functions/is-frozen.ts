
export function isFrozen<T extends object>(obj: T | Readonly<T>): obj is T extends Readonly<T> ? Readonly<T> : T {
  return Object.isFrozen(obj)
}
