
export type Zone = { run: <T = void>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]) => T }
