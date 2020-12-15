
export type HandleClasses = <T extends object, P extends object | object[]>(instanced: T, plain: P) =>
  P extends object[] ? T extends object[] ? T : T[] : T extends object[] ? never : T
