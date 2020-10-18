import { stringify } from '../shortened-functions'

export function shallowCompareObjects(objA: {}, objB: {}): boolean {
  return stringify(objA) == stringify(objB)
}
