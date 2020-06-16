import { Store, TestSubject, TestSubjectFactory } from 'provider'

describe('Store value:', () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  let store: Store<TestSubject>

  beforeEach(async () => {
    const provider = await import('provider')
    store = provider.StoresFactory.createStore<TestSubject>(initialState)
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should disconnect reference.', () => {
    const value = store.value
    value.booleanValue = !value.booleanValue
    expect(store.value).toStrictEqual(initialState)
  })
})
