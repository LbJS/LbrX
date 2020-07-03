import { MomentLike } from '../../types'
import { isDate } from './is-date'
import { isFunction } from './is-function'

export function isMomentObject(value: { [key: string]: any }): value is MomentLike {
  return value._isAMomentObject && isDate(value._d) && isFunction(value.clone)
}
