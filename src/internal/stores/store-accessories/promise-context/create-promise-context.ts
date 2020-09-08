import { PromiseContext } from './promise-context.interface'

export function createPromiseContext(): PromiseContext {
  return {
    promise: null,
    isCancelled: false,
  }
}
