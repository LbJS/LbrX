import { isStackTracingErrors as isStackTracingErrors_type, LbrXManager as LbrXManager_type } from 'lbrx/internal/core'

describe(`LbrXManager - enableStackTracingErrors():`, () => {

  let LbrXManager: typeof LbrXManager_type
  let isStackTracingErrors: typeof isStackTracingErrors_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    LbrXManager = provider.LbrXManager
    isStackTracingErrors = provider.isStackTracingErrors
  })

  it(`should enable stack tracing errors.`, () => {
    LbrXManager.enableStackTracingErrors()
    expect(isStackTracingErrors()).toBeTruthy()
  })

  it(`should return LbrXManager.`, () => {
    const value = LbrXManager.enableStackTracingErrors()
    expect(value).toStrictEqual(LbrXManager)
  })
})
