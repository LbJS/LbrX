
export type NoVoid<T> = T extends void ? never : T
