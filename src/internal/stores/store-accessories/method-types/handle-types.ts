
export type HandleTypes = <T extends object, P extends object | object[]>(instanced: T, plain: P) => P extends P[] ? T[] : T
