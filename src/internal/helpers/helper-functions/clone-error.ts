import { ConstructableError } from '../../types'
import { getOwnPropertyNames } from '../shortened-functions'
import { cloneObject } from './clone-object'
import { isError } from './is-error'
import { isObject } from './is-object'

export function cloneError<T extends Error | object>(error: T): T {
  let copy: T = error
  if (isError<ConstructableError>(error)) {
    copy = new error.constructor()
    getOwnPropertyNames(error).forEach(key => {
      copy[key] = cloneError(error[key])
    })
  } else if (isObject(error)) {
    copy = cloneObject(error)
  }
  return copy
}
