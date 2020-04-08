import { objectAssign, objectKeys, isClass, isObject, isNullable } from 'lbrx/helpers'
import { isArray } from './is-array'

export function instanceHandler<T extends object>(instancedObject: T, plainObject: T): T {
  if (isNullable(plainObject)) return plainObject
  if (isClass(instancedObject) && !isClass(plainObject)) {
    plainObject = instancedObject.constructor.length ?
      objectAssign(new instancedObject.constructor(plainObject), plainObject) :
      objectAssign(new instancedObject.constructor(), plainObject)
  }
  if (isArray(instancedObject) &&
    instancedObject[0] &&
    isArray(plainObject)
  ) {
    for (let i = 0; i < plainObject.length; i++) {
      plainObject[i] = instanceHandler(instancedObject[0], plainObject[i])
    }
  } else {
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
