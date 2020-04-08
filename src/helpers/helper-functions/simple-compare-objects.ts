import { stringify } from 'lbrx/helpers'

export function simpleCompareObjects(objA: object | any[], objB: object | any[]): boolean {
  return stringify(objA) == stringify(objB)
}
