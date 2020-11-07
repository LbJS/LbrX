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
    store[`_stateField`][`isHardResettings`] = true
    store[`_stateField`][`isLoading`] = true
    store[`_stateField`][`isPaused`] = true
    store[`_stateField`][`error`] = {}
    store[`_stateField`][`value`] = {}
    expect(store.storeTag).toBe(StoreTags.destroyed)
    store[`_isDestroyed`] = false
    expect(store.storeTag).toBe(StoreTags.hardResetting)
    store[`_stateField`][`isHardResettings`] = false
    expect(store.storeTag).toBe(StoreTags.loading)
    store[`_stateField`][`isLoading`] = false
    expect(store.storeTag).toBe(StoreTags.paused)
    store[`_stateField`][`isPaused`] = false
    expect(store.storeTag).toBe(StoreTags.error)
    store[`_stateField`][`error`] = null
    expect(store.storeTag).toBe(StoreTags.active)
    store[`_stateField`][`value`] = null
    expect(store.storeTag).toBe(StoreTags.resolving)
  })
})
