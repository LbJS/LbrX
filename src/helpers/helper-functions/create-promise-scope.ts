import { PromiseScope } from '../../types'

export function createPromiseScope(): PromiseScope {
  return {
    promise: null,
    isCancelled: false,
  }
}
