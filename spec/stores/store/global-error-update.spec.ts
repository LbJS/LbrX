import { ErrorFactory } from 'helpers/factories'
import { TestSubject } from 'helpers/test-subjects'
import { GlobalErrorStore, Store } from 'lbrx'

describe('Store Error - Global Error Update', () => {

  const nestedError = ErrorFactory.createNestedError()
  const pureNestedError = ErrorFactory.createNestedError()
  let store: Store<TestSubject, Error>
  let globalErrorStore: GlobalErrorStore<Error>

  beforeEach(async () => {
    const providerModule = await import('provider')
    store = providerModule.StoresFactory.createStore<TestSubject>(null)
    globalErrorStore = providerModule.GlobalErrorStore.getStore()
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should update global error store.', () => {
    store.setError(nestedError)
    expect(globalErrorStore.getError()).toMatchObject(pureNestedError)
  })

  it('should not update global error store with null.', () => {
    store.setError(nestedError)
    store.setError(null)
    expect(globalErrorStore.getError()).toMatchObject(pureNestedError)
  })
})
