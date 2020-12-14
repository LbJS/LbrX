import { newDate, objectAssign, objectKeys } from '../shortened-functions'
import { isArray } from './is-array'
import { isClass } from './is-class'
import { isDate } from './is-date'
import { isEmpty } from './is-empty'
import { isMoment } from './is-moment'
import { isObject } from './is-object'
import { isString } from './is-string'

export function handleClasses<T extends object | object[], P extends object | object[]>(instanced: T, plain: P):
  P extends object[] ? T extends object[] ? T : T[] : T extends object[] ? never : T {
  if (isEmpty(plain)) return plain
  if (isClass(instanced) && !isClass(plain)) {
    if (isString(plain) && plain.length > 0) {
      if (isDate(instanced)) {
        plain = newDate(plain) as P
      } else if (isMoment(instanced)) {
        const clonedMoment = instanced.clone()
        clonedMoment._d = newDate(plain)
        if (instanced._i) clonedMoment._i = newDate(plain)
        plain = clonedMoment as P
      }
    } else if (isObject(plain)) {
      plain = instanced.constructor.length ?
        objectAssign(new instanced.constructor(plain), plain) :
        objectAssign(new instanced.constructor(), plain)
    }
  } else if (isArray(plain)) {
    const instancedValue = isArray(instanced) ? instanced[0] : instanced
    if (instancedValue) {
      for (let i = 0; i < plain.length; i++) {
        plain[i] = handleClasses(instancedValue, plain[i])
      }
    }
    return plain as any
  }
  if (isObject(instanced) && isObject(plain)) {
    for (let i = 0, keys = objectKeys(instanced); i < keys.length; i++) {
      const key = keys[i]
      const instancedProp = instanced[key]
      if (isObject(instancedProp)) {
        plain[key] = handleClasses(instancedProp, plain[key])
      }
    }
  }
  return plain as any
}
