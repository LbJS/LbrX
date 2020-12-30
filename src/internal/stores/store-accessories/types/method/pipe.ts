
export type Pipe<T, R> = (value: T, index?: number, arr?: Pipe<any, any>[]) => R
