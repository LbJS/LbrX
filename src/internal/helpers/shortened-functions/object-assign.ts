
export function objectAssign<T, U>(target: T, source: U): T & U
export function objectAssign<T, U, V>(target: T, source1: U, source2: V): T & U & V
export function objectAssign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W
export function objectAssign(target: object, ...sources: any[]): any
export function objectAssign(target: object, ...sources: any[]): any {
  return Object.assign(target, ...sources)
}
