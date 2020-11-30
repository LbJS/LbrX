import { Actions, Storages, StoreTags } from 'lbrx'
import { Subscription as Subscription_type, timer } from 'rxjs'
import { map } from 'rxjs/operators'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assert, assertNotNullable } from '__test__/functions'
import MockBuilder from '__test__/mock-builder'

describe(`Base Store - hardReset():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type
  let Subscription: typeof Subscription_type

  beforeEach(async () => {
    const rxjs = await import(`rxjs`)
    Subscription = rxjs.Subscription
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    MockBuilder.addLocalStorageMock()
      .addReduxDevToolsExtensionMock()
      .buildMocks()
  })

  it(`should set isInitialized to false.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    await store.hardReset()
    expect(store.isInitialized).toBeFalsy()
  })

  it(`should set the store to "hardResetting" state while resetting it and then "loading".`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.storeTag).toBe(StoreTags.active)
    expect(store[`_lastAction`]).toBe(Actions.init)
    expect(store.state.isLoading).toBeFalsy()
    expect(store.state.isHardResettings).toBeFalsy()
    const hardResettingCPromise = store.hardReset()
    expect(store.storeTag).toBe(StoreTags.hardResetting)
    expect(store[`_lastAction`]).toBe(Actions.hardResetting)
    expect(store.state.isLoading).toBeFalsy()
    expect(store.state.isHardResettings).toBeTruthy()
    await hardResettingCPromise
    expect(store.storeTag).toBe(StoreTags.loading)
    expect(store[`_lastAction`]).toBe(Actions.loading)
    expect(store.state.isLoading).toBeTruthy()
    expect(store.state.isHardResettings).toBeFalsy()
  })

  it(`should update all items in query context list that the store was reseted.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    store.select$().subscribe(() => { })
    store.select$().subscribe(() => { })
    store.select$().subscribe(() => { })
    await store.hardReset()
    expect.assertions(3)
    store[`_queryContextsList`].forEach(x => {
      expect(x.wasHardReset).toBeTruthy()
    })
  })

  it(`should set the store's state value to null.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.value).not.toBeNull()
    await store.hardReset()
    expect(store.rawValue).toBeNull()
  })

  it(`should set the store's initial value to null.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.initialValue).not.toBeNull()
    await store.hardReset()
    expect(store.initialValue).toBeNull()
  })

  it(`should set the store's instanced value to null.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.instancedValue).not.toBeNull()
    await store.hardReset()
    expect(store.instancedValue).toBeNull()
  })

  it(`should set the loading state to true.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.isLoading).toBeFalsy()
    await store.hardReset()
    expect(store.isLoading).toBeTruthy()
  })

  it(`should set the store's error to null.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    store.error = new Error(`Some error`)
    await store.hardReset()
    expect(store.error).toBeNull()
  })

  it(`should set the store's paused state to false.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    store.isPaused = true
    await store.hardReset()
    expect(store.isPaused).toBeFalsy()
  })

  it(`should remove related local storage data if any.`, async () => {
    const store = StoresFactory.createStore(createInitialState(), { name: `TEST-STORE`, storageType: Storages.local })
    const storageDebounceTime = store.config.storageDebounceTime
    await timer(storageDebounceTime).toPromise()
    const storageKey = store.config.name
    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify(createInitialState()))
    await store.hardReset()
    expect(localStorage.getItem(storageKey)).toBeNull()
  })

  it(`should unsubscribe from state to storage subscription.`, async () => {
    const store = StoresFactory.createStore(createInitialState(), { name: `TEST-STORE`, storageType: Storages.local })
    assertNotNullable(store[`_valueToStorageSub`])
    expect(store[`_valueToStorageSub`]).toBeInstanceOf(Subscription)
    expect(store[`_valueToStorageSub`].closed).toBeFalsy()
    await store.hardReset()
    expect(store[`_valueToStorageSub`].closed).toBeTruthy()
  })

  it(`should return store's instance on resolve.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    await expect(store.hardReset()).resolves.toBe(store)
  })

  it(`should cancel async initialization if it's in pending state.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    const testSubjectPromise = timer(500).pipe(map(() => createInitialState())).toPromise()
    store.initializeAsync(testSubjectPromise)
    await store.hardReset()
    await timer(500).toPromise()
    expect(store.rawValue).toBeNull()
  })

  it(`should throw if the store is not resettable.`, async () => {
    const store = StoresFactory.createStore(createInitialState(), { name: `TEST-STORE`, isResettable: false })
    await expect(store.hardReset()).rejects.toBeInstanceOf(Error)
  })

  it(`should cancel, resolve and set to null the lazy init context if it exists.`, async () => {
    const store = StoresFactory.createStore(null)
    const lazyInitPromise = store.initializeLazily(Promise.resolve(createInitialState()))
    const lazyInitContext = store[`_lazyInitContext`]
    await store.hardReset()
    await expect(lazyInitPromise).resolves.toBeUndefined()
    assert(lazyInitContext)
    expect(lazyInitContext.isCanceled).toBeTruthy()
    expect(store[`_lazyInitContext`]).toBeNull()
  })
})
