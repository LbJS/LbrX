import { KeyOrNever } from '../../../../types'

export type Project<T, R> = (value: Readonly<T> | T) => T | R | any[] | T[KeyOrNever<T>] | Pick<T, KeyOrNever<T>>
