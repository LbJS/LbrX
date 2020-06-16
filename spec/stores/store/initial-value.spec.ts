import { assertNotNullable } from 'helpers/functions'
import { LbrXManager as LbrXManager_type } from 'lbrx'
import { Store, TestSubject, TestSubjectFactory } from 'provider'


describe('Store initial value value:', () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  let store: Store<TestSubject>
  let nullStore: Store<TestSubject>
  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import('provider')
    store = provider.StoresFactory.createStore<TestSubject>(initialState, 'TEST-STORE')
    nullStore = provider.StoresFactory.createStore<TestSubject>(null, 'NULL-STORE')
    LbrXManager = provider.LbrXManager
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should be null before initialization.', () => {
    expect(nullStore.initialValue).toBeNull()
  })

  it('should have value after initialization.', () => {
    nullStore.initialize(initialState)
    expect(nullStore.initialValue).toStrictEqual(initialState)
  })

  it('should return a readonly value on dev mode.', () => {
    const value = store.initialValue
    expect(() => {
      assertNotNullable(value)
      assertNotNullable(value.innerTestObject)
      value.innerTestObject.booleanValue = !value.innerTestObject.booleanValue
    }).toThrow()
  })

  it('should return a non readonly value on prod mode.', () => {
    LbrXManager.enableProdMode()
    const value = store.initialValue
    expect(() => {
      assertNotNullable(value)
      assertNotNullable(value.innerTestObject)
      value.innerTestObject.booleanValue = !value.innerTestObject.booleanValue
    }).not.toThrow()
  })
})
