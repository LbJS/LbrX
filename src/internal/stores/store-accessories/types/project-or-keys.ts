
export type ProjectsOrKeys<T, R> =
  ((value: Readonly<T>) => T | R)
  | ((value: Readonly<T>) => R)[]
  | string
  | string[]
