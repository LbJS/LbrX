import { newDate, objectAssign, objectKeys } from '../shortened-functions'
import { isArray } from './is-array'
import { isClass } from './is-class'
import { isDate } from './is-date'
import { isEmpty } from './is-empty'
import { isMoment } from './is-moment'
import { isObject } from './is-object'
import { isString } from './is-string'

export function handleObjectTypes<T extends object>(instancedObj: T, plainObj: object): T
export function handleObjectTypes<T extends object>(instancedObj: T, plainObjs: object[]): T[]
export function handleObjectTypes<T extends object>(instanced: T, plain: object | object[]): T | T[] {
  if (isEmpty(plain)) return plain
  if (isClass(instanced) && !isClass(plain)) {
    if (isString(plain) && plain.length > 0) {
      if (isDate(instanced)) {
        plain = newDate(plain)
      } else if (isMoment(instanced)) {
        const clonedMoment = instanced.clone()
        clonedMoment._d = newDate(plain)
        if (instanced._i) clonedMoment._i = newDate(plain)
        plain = clonedMoment
      }
    } else if (isObject(plain)) {
      if (instanced.constructor.length) {
        plain = objectAssign(new instanced.constructor(plain), plain)
        plain = new instanced.constructor(plain)
      } else {
        plain = objectAssign(new instanced.constructor(), plain)
      }
      plain = instanced.constructor.length ?
        new instanced.constructor(plain) :
        objectAssign(new instanced.constructor(), plain)
    }
  } else if (isArray(plain)) {
    const instancedValue = isArray(instanced) ? instanced[0] : instanced
    if (instancedValue) {
      for (let i = 0; i < plain.length; i++) {
        plain[i] = handleObjectTypes(instancedValue, plain[i])
      }
    }
    return plain as T
  }
  if (isObject(instanced) && isObject(plain)) {
    for (let i = 0, keys = objectKeys(instanced); i < keys.length; i++) {
      const key = keys[i]
      const instancedProp = instanced[key]
      if (isObject(instancedProp)) {
        plain[key] = handleObjectTypes(instancedProp, plain[key])
      }
    }
  }
  return plain as T
}
