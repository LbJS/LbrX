import { Store, StoreConfigOptions } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { TestSubjectFactory } from '__test__/factories'
import { TestSubject } from '__test__/test-subjects'

describe(`Store reset():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  let store: Store<TestSubject>
  let notResettableStore: Store<TestSubject>
  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    LbrXManager = provider.LbrXManager
    store = provider.StoresFactory.createStore(createInitialState())
    const notResettableStoreConfig: StoreConfigOptions = {
      name: `NOT-RESETTABLE-STORE`,
      isResettable: false
    }
    notResettableStore = provider.StoresFactory.createStore(createInitialState(), notResettableStoreConfig)
  })

  it(`should reset the store's state to its initial value.`, () => {
    store.update(createStateA())
    store.reset()
    expect(store.value).toStrictEqual(createInitialState())
  })

  it(`should throw if the store is in loading state.`, () => {
    (store as any)._state.isLoading = true
    expect(() => {
      store.reset()
    }).toThrow()
  })

  it(`should throw if the store is not resettable .`, () => {
    expect(() => {
      notResettableStore.reset()
    }).toThrow()
  })

  it(`should throw if there is no initial state.`, () => {
    (store as any)._initialValue = null
    expect(() => {
      store.reset()
    }).toThrow()
  })

  it(`should reset the store's state to its initial value with different reference.`, () => {
    store.update(createStateA())
    store.reset()
    expect(store.value).not.toBe(store.initialValue)
  })
})
