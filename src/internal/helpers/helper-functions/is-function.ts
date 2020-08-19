
// tslint:disable-next-line: ban-types
export function isFunction(value: any): value is Function {
  return typeof value == 'function'
}
