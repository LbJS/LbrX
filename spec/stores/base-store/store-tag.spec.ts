import { Store as Store_type, StoreTags } from 'lbrx'

describe(`Base Store - store tag:`, () => {

  let Store: typeof Store_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    Store = provider.Store
  })

  it(`should resolve the right tag by priority.`, () => {
    class FooStore extends Store<{}> {
      constructor() {
        super(null, { name: `FOO-STORE` })
      }
    }
    const store = new FooStore()
    store[`_isDestroyed`] = true
    store[`_stateSource`][`isHardResettings`] = true
    store[`_stateSource`][`isLoading`] = true
    store[`_stateSource`][`isPaused`] = true
    store[`_stateSource`][`error`] = {}
    store[`_stateSource`][`value`] = {}
    expect(store.storeTag).toBe(StoreTags.destroyed)
    store[`_isDestroyed`] = false
    expect(store.storeTag).toBe(StoreTags.hardResetting)
    store[`_stateSource`][`isHardResettings`] = false
    expect(store.storeTag).toBe(StoreTags.loading)
    store[`_stateSource`][`isLoading`] = false
    expect(store.storeTag).toBe(StoreTags.paused)
    store[`_stateSource`][`isPaused`] = false
    expect(store.storeTag).toBe(StoreTags.error)
    store[`_stateSource`][`error`] = null
    expect(store.storeTag).toBe(StoreTags.active)
    store[`_stateSource`][`value`] = null
    expect(store.storeTag).toBe(StoreTags.resolving)
  })
})
