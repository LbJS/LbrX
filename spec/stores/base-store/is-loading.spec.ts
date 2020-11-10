import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { StoreTags } from 'lbrx/internal/stores/store-accessories'
import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - isLoading:`, () => {

  let StoresFactory: typeof StoresFactory_type
  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    LbrXManager = provider.LbrXManager
  })

  it(`should return false if initial state is provided.`, done => {
    const store = StoresFactory.createStore({ foo: `foo` }, { name: `TEST-STORE` })
    expect(store.isLoading).toBeFalsy()
    expect(store.storeTag).not.toBe(StoreTags.loading)
    store.isLoading$.subscribe(isLoading => {
      expect(isLoading).toBeFalsy()
      done()
    })
  })

  it(`should return true if initial state isn't provided.`, done => {
    const store = StoresFactory.createStore(null, { name: `TEST-STORE` })
    expect(store.isLoading).toBeTruthy()
    expect(store.storeTag).toBe(StoreTags.loading)
    store.isLoading$.subscribe(isLoading => {
      expect(isLoading).toBeTruthy()
      done()
    })
  })

  it(`should emit only distinct values.`, async () => {
    const values = [true, false, false, true, true]
    const expectedValues = [true, false, true]
    const actualValues: boolean[] = []
    const store = StoresFactory.createStore(null, { name: `TEST-STORE` })
    store.isLoading$.subscribe(isLoading => {
      actualValues.push(isLoading)
    })
    values.forEach(value => {
      store[`_isLoading$`].next(value)
    })
    await Promise.resolve()
    expect(expectedValues).toStrictEqual(actualValues)
  })
})
