import { isArray, isDate, isError } from 'helpers'

export function isEntity(value: any): value is object {
  return value && typeof value == 'object' && !isArray(value) && !isDate(value) && !isError(value)
}
