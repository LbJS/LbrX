
export type KeyOrNever<T> = T extends object ? keyof T : never
