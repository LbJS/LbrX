import { objectAssign, objectKeys } from '../short-hand-functions'
import { isArray } from './is-array'
import { isClass } from './is-class'
import { isObject } from './is-object'

export function cloneObject<T extends object>(obj: T): T {
  let copy: T | any[] | null = null
  if (isArray(obj)) {
    copy = [...obj]
    for (let i = 0; i < copy.length; i++) {
      if (isObject(copy[i])) copy[i] = cloneObject(copy[i])
    }
  } else if (isClass(obj)) {
    copy = obj.constructor.length ?
      new obj.constructor(obj) as T :
      objectAssign(new obj.constructor() as T, obj)
  } else if (isObject(obj)) {
    copy = { ...obj }
  }
  if (!copy) return obj
  for (let i = 0, keys = objectKeys(copy); i < keys.length; i++) {
    const key = keys[i]
    const objProp = copy[key]
    if (isObject(objProp)) copy[key] = cloneObject(objProp)
  }
  return copy as T
}
