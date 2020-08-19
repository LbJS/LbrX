import { stringify } from '../shortened-functions'

export function simpleCompareObjects(objA: {}, objB: {}): boolean {
  return stringify(objA) == stringify(objB)
}
