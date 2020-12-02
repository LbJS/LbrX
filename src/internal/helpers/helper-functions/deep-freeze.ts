import { getOwnPropertyNames } from '../shortened-functions'
import { freezeDate } from './freeze-date'
import { isDate } from './is-date'
import { isObject } from './is-object'

// TODO: fix multiple freezes error on same object
export function deepFreeze<T extends object>(object: T): Readonly<T> {
  for (const key of getOwnPropertyNames(object)) {
    const value = object[key]
    if (isDate(value)) object[key] = freezeDate(value)
    else if (isObject(value)) object[key] = deepFreeze(value)
  }
  return Object.freeze(object)
}
