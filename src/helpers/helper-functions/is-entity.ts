import { isArray } from './is-array'
import { isDate } from './is-date'
import { isError } from './is-error'

export function isEntity(value: any): value is object {
  return value && typeof value == 'object' && !isArray(value) && !isDate(value) && !isError(value)
}
