
// tslint:disable: ban-types
export function objectFreeze<T>(a: T[]): readonly T[]
export function objectFreeze<T extends Function>(f: T): T
export function objectFreeze<T>(o: T): Readonly<T>
export function objectFreeze(obj: any): Readonly<any> {
  return Object.freeze(obj)
}
