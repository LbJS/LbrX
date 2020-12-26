import { PlainObject } from '../../types'
import { isObject } from './is-object'

export function isPlainObject<T = PlainObject>(value: any): value is T {
  return isObject(value) && value.constructor.name === `Object`
}
