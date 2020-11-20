import { Actions, StoreTags } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - isPaused:`, () => {

  let StoresFactory: typeof StoresFactory_type
  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    LbrXManager = provider.LbrXManager
  })

  it(`should return false by default.`, done => {
    const store = StoresFactory.createStore(null, { name: `TEST-STORE` })
    expect(store.isPaused).toBeFalsy()
    expect(store.storeTag).not.toBe(StoreTags.paused)
    store.isPaused$.subscribe(isPaused => {
      expect(isPaused).toBeFalsy()
      done()
    })
  })

  it(`should allow changing the paused state.`, () => {
    const store = StoresFactory.createStore({ foo: `foo` }, { name: `TEST-STORE` })
    store.isPaused = true
    expect(store.isPaused).toBeTruthy()
    expect(store.storeTag).toBe(StoreTags.paused)
    expect(store[`_lastAction`]).toBe(Actions.paused)
    store.isPaused = false
    expect(store.isPaused).toBeFalsy()
    expect(store.storeTag).toBe(StoreTags.active)
    expect(store[`_lastAction`]).toBe(Actions.unpause)
  })

  it(`should emit only distinct values.`, async () => {
    const values = [true, false, false, true, true]
    const expectedValues = [false, true, false, true]
    const actualValues: boolean[] = []
    const store = StoresFactory.createStore(null, { name: `TEST-STORE` })
    store.isPaused$.subscribe(isPaused => {
      actualValues.push(isPaused)
    })
    values.forEach(value => {
      store.isPaused = value
    })
    await Promise.resolve()
    expect(expectedValues).toStrictEqual(actualValues)
  })
})
