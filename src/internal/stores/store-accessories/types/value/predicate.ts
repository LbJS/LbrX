
export type Predicate<T, U = T> = (value: Readonly<T> | Readonly<U>, index: number, array: readonly T[] | readonly U[]) => boolean
