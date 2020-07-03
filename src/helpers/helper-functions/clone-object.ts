import { objectAssign, objectKeys } from '../short-hand-functions'
import { isArray } from './is-array'
import { isClass } from './is-class'
import { isEmpty } from './is-empty'
import { isMomentObject } from './is-moment-object'
import { isObject } from './is-object'

export function cloneObject<T extends object>(obj: T): T {
  let copy: T | any[] | null = null
  if (isArray(obj)) {
    copy = [...obj]
    for (let i = 0; i < copy.length; i++) {
      if (isObject(copy[i])) copy[i] = cloneObject(copy[i])
    }
  } else if (isClass(obj)) {
    if (isMomentObject(obj)) return obj.clone() as T
    copy = obj.constructor.length ?
      objectAssign(new obj.constructor(obj), obj) :
      objectAssign(new obj.constructor(), obj)
  } else if (isObject(obj)) {
    copy = { ...obj }
  }
  if (isObject(copy)) {
    for (let i = 0, keys = objectKeys(copy); i < keys.length; i++) {
      const key = keys[i]
      const objProp = copy[key]
      if (isObject(objProp)) copy[key] = cloneObject(objProp)
    }
  }
  return isEmpty(copy) ? obj : copy as T
}
