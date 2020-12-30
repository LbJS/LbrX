import { KeyOrNever, NoVoid } from '../../../../types'

export type ProjectsOrKeys<T, R> =
  ((value: Readonly<T>) => T | NoVoid<R>)
  | ((value: Readonly<T>) => NoVoid<R>)[]
  | KeyOrNever<T>
  | KeyOrNever<T>[]
