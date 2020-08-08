import { newDate, objectAssign, objectKeys } from '../short-hand-functions'
import { isArray } from './is-array'
import { isClass } from './is-class'
import { isDate } from './is-date'
import { isEmpty } from './is-empty'
import { isMoment } from './is-moment'
import { isObject } from './is-object'

export function cloneObject<T extends object>(obj: T): T
export function cloneObject<T extends object>(objArr: T[]): T[]
export function cloneObject<T extends object>(obj: T | T[]): T | T[] {
  let copy: T | any[] | null = null
  if (isArray(obj)) {
    copy = [...obj]
    for (let i = 0; i < copy.length; i++) {
      if (isObject(copy[i])) copy[i] = cloneObject(copy[i])
    }
  } else if (isClass(obj)) {
    if (isMoment(obj)) return obj.clone() as T
    if (isDate(obj)) return newDate(obj) as T
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
