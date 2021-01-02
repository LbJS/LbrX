
export type GetReturnType<T extends object, R> = T | R | R[] | T[keyof T] | Pick<T, keyof T>
