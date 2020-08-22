import { throwError } from './throw-error'

export function assert(condition: any, errMsg: string): asserts condition {
  if (!condition) throwError(errMsg)
}
