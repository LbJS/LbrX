import { assertNotNullable } from 'helpers/functions'
import { Store, TestSubject, TestSubjectFactory } from 'provider'

describe('Store state:', () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  let store: Store<TestSubject>

  beforeEach(async () => {
    const provider = await import('provider')
    store = provider.StoresFactory.createStore<TestSubject>(initialState, 'TEST-STORE')
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should disconnect reference.', () => {
    const value = store.state
    assertNotNullable(value)
    value.booleanValue = !value.booleanValue
    expect(store.state).toStrictEqual(initialState)
  })
})
