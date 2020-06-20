import { objectKeys } from '../short-hand-functions'
import { isArray } from './is-array'
import { isDate } from './is-date'
import { isEmpty } from './is-empty'
import { isFunction } from './is-function'
import { isObject } from './is-object'

export function compareObjects(objA: object | unknown[], objB: object | unknown[]): boolean {
  if (isEmpty(objA) || isEmpty(objB)) return objA === objB
  if (isDate(objA) && (!isDate(objB) || objA.getTime() != objB.getTime())) return false
  const compareHelper = (x: unknown, y: unknown): boolean => {
    if (isObject(x)) {
      if (!isObject(y) || !compareObjects(x, y)) return false
    } else if (isFunction(x)) {
      if (!isFunction(y)) return false
    } else if (x !== y) {
      return false
    }
    return true
  }
  if (isArray(objA)) {
    if (isArray(objB) &&
      objA.length == objB.length
    ) {
      for (let i = 0; i < objA.length; i++) {
        if (!compareHelper(objA[i], objB[i])) return false
      }
      return true
    }
    return false
  }
  for (let i = 0, keys = objectKeys(objA); i < keys.length; i++) {
    const p = keys[i]
    if (objA.hasOwnProperty(p) != objB.hasOwnProperty(p)) return false
    if (!compareHelper(objA[p], objB[p])) return false
  }
  for (let i = 0, keys = objectKeys(objB); i < keys.length; i++) {
    if (!objA.hasOwnProperty(keys[i])) return false
  }
  return true
}
