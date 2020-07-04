import { objectAssign, objectKeys } from '../short-hand-functions'
import { isArray } from './is-array'
import { isClass } from './is-class'
import { isDate } from './is-date'
import { isEmpty } from './is-empty'
import { isMoment } from './is-moment-object'
import { isObject } from './is-object'
import { isString } from './is-string'
import { newDate } from './new-date'

export function instanceHandler<T extends object>(instancedObject: T, plainObject: T): T {
  if (isEmpty(plainObject)) return plainObject
  if (isClass(instancedObject) && !isClass(plainObject)) {
    if (isString(plainObject) && plainObject.length > 0) {
      if (isDate(instancedObject)) {
        plainObject = newDate(plainObject) as T
      } else if (isMoment(instancedObject)) {
        const clonedMomentObj = instancedObject.clone()
        clonedMomentObj._d = newDate(plainObject)
        if (clonedMomentObj._i) clonedMomentObj._i = newDate(plainObject)
        plainObject = clonedMomentObj as T
      }
    } else if (isObject(plainObject)) {
      if (instancedObject.constructor.length) {
        plainObject = objectAssign(new instancedObject.constructor(plainObject), plainObject)
        plainObject = new instancedObject.constructor(plainObject)
      } else {
        plainObject = objectAssign(new instancedObject.constructor(), plainObject)
      }
      plainObject = instancedObject.constructor.length ?
        new instancedObject.constructor(plainObject) :
        objectAssign(new instancedObject.constructor(), plainObject)
    }
  } else if (isArray(instancedObject) &&
    instancedObject[0] &&
    isArray(plainObject)
  ) {
    for (let i = 0; i < plainObject.length; i++) {
      plainObject[i] = instanceHandler(instancedObject[0], plainObject[i])
    }
    return plainObject
  }
  if (isObject(instancedObject) && isObject(plainObject)) {
    for (let i = 0, keys = objectKeys(instancedObject); i < keys.length; i++) {
      const key = keys[i]
      const instancedObjectProp = instancedObject[key]
      if (isObject(instancedObjectProp)) {
        plainObject[key] = instanceHandler(instancedObjectProp, plainObject[key])
      }
    }
  }
  return plainObject
}
