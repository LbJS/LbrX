import { parse, stringify } from '../shortened-functions'
import { isObject } from './is-object'

export function shallowCloneObject<T extends object>(obj: T): T
export function shallowCloneObject<T extends object>(objArr: T[]): T[]
export function shallowCloneObject<T extends object>(obj: T | T[]): T | T[] {
  return isObject(obj) ? parse(stringify(obj)) : obj
}
