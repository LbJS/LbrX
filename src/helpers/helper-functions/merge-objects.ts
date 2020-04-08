import { objectKeys, objectAssign, isObject, isDate } from 'lbrx/helpers'
import { isArray } from './is-array'

export function mergeObjects<T extends object>(target: T, source: Partial<T>): T {
  for (let i = 0, keys = objectKeys(target); i < keys.length; i++) {
    const key = keys[i]
    const targetProp = target[key]
    const sourceProp = source[key]
    if (isDate(targetProp) || isDate(sourceProp)) {
      target[key] = sourceProp
    } else if (isObject(targetProp) &&
      isObject(sourceProp) &&
      !isArray(targetProp) &&
      !isArray(sourceProp)
    ) {
      source[key] = mergeObjects(targetProp, sourceProp)
    }
  }
  return objectAssign(target, source)
}
