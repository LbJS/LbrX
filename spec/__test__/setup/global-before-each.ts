import { LbrXManager } from 'lbrx/core'

globalThis.beforeEach(() => {
  LbrXManager.enableStackTracingErrors()
})
