import { isArray, isDate, isError } from 'lbrx/helpers'

export function isEntity(value: any): value is object {
  return value && typeof value == 'object' && !isArray(value) && !isDate(value) && !isError(value)
}
