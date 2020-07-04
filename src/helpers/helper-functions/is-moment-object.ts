import { MomentLike } from '../../types'
import { isDate } from './is-date'
import { isFunction } from './is-function'
import { isObject } from './is-object'

export function isMoment(value: any): value is MomentLike {
  return isObject<{ [key: string]: any }>(value) && value._isAMomentObject && isDate(value._d) && isFunction(value.clone)
}
