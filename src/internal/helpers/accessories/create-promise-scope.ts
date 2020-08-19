import { PromiseScope } from './promise-scope.type'

export function createPromiseScope(): PromiseScope {
  return {
    promise: null,
    isCancelled: false,
  }
}
