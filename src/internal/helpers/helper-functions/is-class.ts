import { Constructable } from '../../types'
import { isObject } from './is-object'

export function isClass(value: {}): value is Constructable {
  return isObject(value) && value.constructor.name !== `Object`
}
