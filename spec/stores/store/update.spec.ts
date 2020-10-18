import { Store } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { TestSubjectFactory } from '__test__/factories'
import { TestSubject } from '__test__/test-subjects'

describe(`Store update():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let LbrXManager: typeof LbrXManager_type
  let store: Store<TestSubject>
  let asyncStore: Store<TestSubject>
  let partialState: Partial<TestSubject>


  beforeEach(async () => {
    const provider = await import(`provider`)
    store = provider.StoresFactory.createStore(createInitialState())
    asyncStore = provider.StoresFactory.createStore<TestSubject>(null, `ASYNC-STORE`)
    LbrXManager = provider.LbrXManager
    partialState = { stringValue: `some other string` }
  })

  it(`should update the store's state.`, () => {
    expect(store.value).toStrictEqual(createInitialState())
    store.update(partialState)
    const expectedState = createInitialState()
    expectedState.stringValue = partialState.stringValue!
    expect(store.value).toStrictEqual(expectedState)
  })

  it(`should throw if the state's value is \`null\`.`, () => {
    (store as any)._state.value = null
    expect(store.value).toBeNull()
    expect(() => {
      store.update(partialState)
    }).toThrow()
  })

  it(`should throw if the store is in 'LOADING' state.`, () => {
    (store as any)._state.isLoading = true
    expect(() => {
      store.update(partialState)
    }).toThrow()
    expect(store.value).toStrictEqual(createInitialState())
  })

  it(`should throw if the store wasn't initialized.`, () => {
    (store as any)._state.isLoading = false
    expect(() => {
      asyncStore.update(partialState)
    }).toThrow()
    expect(asyncStore.value).toBeNull()
  })
})
