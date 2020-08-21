
export interface PromiseScope {
  promise: Promise<void> | null
  isCancelled: boolean
}
