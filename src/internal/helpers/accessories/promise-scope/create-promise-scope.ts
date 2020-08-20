import { PromiseScope } from './promise-scope.interface'

export function createPromiseScope(): PromiseScope {
  return {
    promise: null,
    isCancelled: false,
  }
}
