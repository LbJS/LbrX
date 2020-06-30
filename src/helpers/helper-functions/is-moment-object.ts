import { isDate } from './is-date'

export function isMomentObject(value: { [key: string]: any }): value is { _d: Date } {
  return value._isAMomentObject && isDate(value._d)
}
