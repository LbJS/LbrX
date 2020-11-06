import { Store, TestSubject, TestSubjectFactory } from 'provider'
import { assertNotNullable } from '__test__/functions'

describe(`Store value:`, () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  let store: Store<TestSubject>

  beforeEach(async () => {
    const provider = await import(`provider`)
    store = provider.StoresFactory.createStore<TestSubject>(initialState, `TEST-STORE`)
  })

  afterEach(() => {
    jest.resetModules()
  })

  it(`should disconnect reference.`, () => {
    const value = store.value
    assertNotNullable(value)
    value.booleanValue = !value.booleanValue
    expect(store.value).toStrictEqual(initialState)
  })
})
