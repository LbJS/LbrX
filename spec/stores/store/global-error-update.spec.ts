import { ErrorFactory } from 'helpers/factories'
import { TestSubject } from 'helpers/test-subjects'
import { LbrxErrorStore, Store } from 'lbrx'

describe('Store Error - Global Error Update', () => {

  const nestedError = ErrorFactory.createNestedError()
  const pureNestedError = ErrorFactory.createNestedError()
  let store: Store<TestSubject, Error>
  let lbrxErrorStore: LbrxErrorStore<Error>

  beforeEach(async () => {
    const providerModule = await import('provider')
    store = providerModule.StoresFactory.createStore<TestSubject>(null)
    lbrxErrorStore = providerModule.LbrxErrorStore.getStore()
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should update global error store.', () => {
    store.error = nestedError
    expect(lbrxErrorStore.getError()).toMatchObject(pureNestedError)
  })

  it('should not update global error store with null.', () => {
    store.error = nestedError
    store.error = null
    expect(lbrxErrorStore.getError()).toMatchObject(pureNestedError)
  })
})
