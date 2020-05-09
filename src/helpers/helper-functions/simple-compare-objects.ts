import { stringify } from '../short-hand-functions'

export function simpleCompareObjects(objA: object | any[], objB: object | any[]): boolean {
  return stringify(objA) == stringify(objB)
}
