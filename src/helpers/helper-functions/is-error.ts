import { ConstructableError } from '../../types'

export function isError(value: any): value is Error & ConstructableError {
  return value instanceof Error
}
