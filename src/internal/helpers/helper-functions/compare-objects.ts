import { objectKeys } from '../shortened-functions'
import { isArray } from './is-array'
import { isDate } from './is-date'
import { isFunction } from './is-function'
import { isMoment } from './is-moment'
import { isObject } from './is-object'

export function compareObjects(objA: {}, objB: {}): boolean {
  if (isDate(objA) || isDate(objB)) return isDate(objA) && isDate(objB) && objA.getTime() == objB.getTime()
  if (isMoment(objA) || isMoment(objB)) return isMoment(objA) && isMoment(objB) && objA.valueOf() == objB.valueOf()
  if (isArray(objA) && isArray(objB)) {
    if (objA.length != objB.length) return false
    for (let i = 0; i < objA.length; i++) {
      if (!compareObjects(objA[i], objB[i])) return false
    }
    return true
  }
  if (isObject(objA) && isObject(objB) && !isArray(objA) && !isArray(objB)) {
    for (let i = 0, keys = objectKeys(objA); i < keys.length; i++) {
      const key = keys[i]
      if (!objB.hasOwnProperty(key)) return false
      if (!compareObjects(objA[key], objB[key])) return false
    }
    for (let i = 0, keys = objectKeys(objB); i < keys.length; i++) {
      if (!objA.hasOwnProperty(keys[i])) return false
    }
    return true
  }
  if (isFunction(objA) && isFunction(objB)) return true
  return objA === objB
}
