import { GlobalErrorStore, Store } from 'lbrx'
import { TestSubjectsFactory, TestSubjectA } from 'test-subjects'

describe('Store Error - Global Error Update', () => {

  const nestedError = TestSubjectsFactory.createNestedError()
  const pureNestedError = TestSubjectsFactory.createNestedError()
  let store: Store<TestSubjectA, Error>
  let globalErrorStore: GlobalErrorStore<Error>

  beforeEach(async () => {
    const providerModule = await import('provider.module')
    store = providerModule.StoresFactory.createStore<TestSubjectA>(null)
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
