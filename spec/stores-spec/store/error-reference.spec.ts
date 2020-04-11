import { assertNotNullable } from 'helpers'
import { Store } from 'lbrx'
import { ErrorTestSubject, TestSubject, TestSubjectsFactory } from 'test-subjects'

describe('Store Error Reference:', () => {

  const error = TestSubjectsFactory.createError()
  const nestedError = TestSubjectsFactory.createNestedError()
  const pureNestedError = TestSubjectsFactory.createNestedError()
  const initialState = TestSubjectsFactory.createTestSubject_initial()
  let store: Store<TestSubject, Error>
  let loadingStore: Store<TestSubject, ErrorTestSubject>

  beforeEach(async () => {
    const providerModule = await import('provider.module')
    store = providerModule.StoresFactory.createStore(initialState)
    loadingStore = providerModule.StoresFactory.createStore<TestSubject>(null, 'LOADING-STORE')
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should return the exact same error.', () => {
    loadingStore.setError(nestedError)
    expect(loadingStore.getError()).toStrictEqual(pureNestedError)
  })

  it('should return the error with different reference after setting it.', () => {
    store.setError(error)
    expect(store.getError()).toBeTruthy()
    expect(store.getError()).not.toBe(error)
  })

  it('should return the error with different reference for the inner error after setting it.', () => {
    assertNotNullable(nestedError?.innerError?.innerError)
    loadingStore.setError(nestedError)
    const storesError = loadingStore.getError()
    assertNotNullable(storesError?.innerError?.innerError)
    expect(storesError.innerError.innerError).not.toBe(nestedError.innerError.innerError)
  })

  it('should not be effected by error object change after set.', () => {
    const newErrorMsg = 'New error message'
    const localError = TestSubjectsFactory.createError()
    store.setError(localError)
    localError.message = newErrorMsg
    const storesError = store.getError()
    assertNotNullable(storesError)
    expect(storesError.message).toBeTruthy()
    expect(storesError.message).not.toBe(newErrorMsg)
  })

  it('should not be effected by returned error object change.', () => {
    const newErrorMsg = 'New error message'
    let localError: Error | null = TestSubjectsFactory.createError()
    store.setError(localError)
    localError = store.getError()
    assertNotNullable(localError)
    localError.message = newErrorMsg
    const storesError = store.getError()
    assertNotNullable(storesError)
    expect(storesError.message).toBeTruthy()
    expect(storesError.message).not.toBe(newErrorMsg)
  })

  it('should have different nested custom error object reference.', () => {
    loadingStore.setError(nestedError)
    assertNotNullable(nestedError.innerError?.innerError)
    const storesError = loadingStore.getError()
    assertNotNullable(storesError?.innerError?.innerError)
    expect(storesError.innerError.innerError).not.toBe(nestedError.innerError.innerError)
  })

  it("should not be effected by custom error object's change after set.", () => {
    const newErrorMsg = 'New error message'
    const localError = TestSubjectsFactory.createNestedError()
    loadingStore.setError(localError)
    assertNotNullable(localError.innerError?.innerError)
    localError.innerError.innerError.message = newErrorMsg
    const storesError = loadingStore.getError()
    assertNotNullable(storesError?.innerError?.innerError)
    expect(storesError.innerError.innerError).not.toBe(newErrorMsg)
  })
})
