import { objectAssign, objectKeys } from '../short-hand-functions'
import { isEntity } from './is-entity'

export function mergeObjects<T extends object>(target: T, source: Partial<T>): T {
  for (let i = 0, keys = objectKeys(target); i < keys.length; i++) {
    const key = keys[i]
    const targetProp = target[key]
    const sourceProp = source[key]
    if (isEntity(targetProp) && isEntity(sourceProp)) {
      source[key] = mergeObjects(targetProp, sourceProp)
    }
  }
  return objectAssign(target, source)
}
