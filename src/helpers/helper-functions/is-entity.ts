import { isArray } from './is-array'
import { isDate } from './is-date'

export function isEntity(value: any): value is object {
  return value && typeof value == 'object' && !isArray(value) && !isDate(value)
}
