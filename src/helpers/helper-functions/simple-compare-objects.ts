import { stringify } from '../short-hand-functions'

export function simpleCompareObjects(objA: {}, objB: {}): boolean {
  return stringify(objA) == stringify(objB)
}
