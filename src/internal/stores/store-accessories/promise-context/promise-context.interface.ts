
export interface PromiseContext {
  promise: Promise<void> | null
  isCancelled: boolean
}
