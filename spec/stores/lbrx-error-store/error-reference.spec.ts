import { ErrorFactory } from 'helpers/factories'
import { assertNotNullable } from 'helpers/functions'
import { CustomError } from 'helpers/test-subjects'
import { LbrxErrorStore } from 'lbrx'

describe('Global Error Store - Error Reference:', () => {

  const errMsg = 'New Error Msg'
  const error = ErrorFactory.createError()
  const nestedError = ErrorFactory.createNestedError()
  let lbrxErrorStore: LbrxErrorStore<Error>

  beforeEach(async () => {
    const providerModule = await import('provider')
    lbrxErrorStore = providerModule.LbrxErrorStore.getStore()
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should have different error object reference.', () => {
    lbrxErrorStore.setError(error)
    expect(lbrxErrorStore.getError()).not.toBe(error)
  })

  it("should not be effected by error object's change after set.", () => {
    const localError = ErrorFactory.createError()
    lbrxErrorStore.setError(localError)
    localError.message = errMsg
    const storeError = lbrxErrorStore.getError()
    assertNotNullable(storeError)
    expect(storeError.message).toBeTruthy()
    expect(storeError.message).not.toBe(errMsg)
  })

  it("should not be effected by returned error object's change.", () => {
    let localError: Error | null = ErrorFactory.createError()
    lbrxErrorStore.setError(localError)
    localError = lbrxErrorStore.getError()
    assertNotNullable(localError)
    localError.message = errMsg
    const storeError = lbrxErrorStore.getError()
    assertNotNullable(storeError)
    expect(storeError.message).toBeTruthy()
    expect(storeError.message).not.toBe(errMsg)
  })

  it('should have different nested custom error object reference.', () => {
    lbrxErrorStore.setError(nestedError)
    assertNotNullable(nestedError.innerError?.innerError)
    const storeError = lbrxErrorStore.getError() as CustomError
    assertNotNullable(storeError?.innerError?.innerError)
    expect(storeError.innerError.innerError).not.toBe(nestedError.innerError.innerError)
  })

  it("should not be effected by custom error object's change after set.", () => {
    const localNestedError = ErrorFactory.createNestedError()
    lbrxErrorStore.setError(localNestedError)
    assertNotNullable(localNestedError.innerError?.innerError)
    localNestedError.innerError.innerError.message = errMsg
    const storeError = lbrxErrorStore.getError() as CustomError
    assertNotNullable(storeError?.innerError?.innerError)
    expect(storeError.innerError.innerError.message).toBeTruthy()
    expect(storeError.innerError.innerError.message).not.toBe(errMsg)
  })
})
