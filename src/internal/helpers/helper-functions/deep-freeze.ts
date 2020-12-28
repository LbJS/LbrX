import { getOwnPropertyNames } from '../shortened-functions'
import { freezeDate } from './freeze-date'
import { isDate } from './is-date'
import { isObject } from './is-object'
import { objectFreeze } from './object-freeze'

export function deepFreeze<T extends object>(object: T): Readonly<T> {
  for (const key of getOwnPropertyNames(object)) {
    const value = object[key]
    let frozenValue: {} | void
    if (isDate(value)) frozenValue = freezeDate(value)
    else if (isObject(value)) frozenValue = deepFreeze(value)
    if (!frozenValue) continue
    const descriptor = Object.getOwnPropertyDescriptor(object, key)
    if (descriptor?.writable) object[key] = frozenValue
  }
  return objectFreeze(object)
}
