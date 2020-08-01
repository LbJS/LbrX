import { parse, stringify } from '../short-hand-functions'
import { isObject } from './is-object'

export function simpleCloneObject<T extends object>(obj: T): T {
  return isObject(obj) ? parse(stringify(obj)) : obj
}
