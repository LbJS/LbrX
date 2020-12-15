
export type ProjectsOrKeys<T, R, K = keyof T> =
  ((value: Readonly<T>) => T | R)
  | ((value: Readonly<T>) => R)[]
  | K
  | K[]
