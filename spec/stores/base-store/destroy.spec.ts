import { Actions, Storages, StoreTags } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { DevToolsAdapter as DevToolsAdapter_type } from 'lbrx/internal/dev-tools'
import { Subject as Subject_type, Subscription as Subscription_type, timer } from 'rxjs'
import { map } from 'rxjs/operators'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assert, assertNotNullable } from '__test__/functions'
import MockBuilder from '__test__/mock-builder'

describe(`Base Store - destroy():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type
  let Subscription: typeof Subscription_type
  let Subject: typeof Subject_type
  let LbrXManager: typeof LbrXManager_type
  let DevToolsAdapter: typeof DevToolsAdapter_type

  beforeEach(async () => {
    const rxjs = await import(`rxjs`)
    Subscription = rxjs.Subscription
    Subject = rxjs.Subject
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    LbrXManager = provider.LbrXManager
    DevToolsAdapter = provider.DevToolsAdapter
    MockBuilder.addLocalStorageMock()
      .addReduxDevToolsExtensionMock()
      .buildMocks()
  })

  it(`should set isInitialized to false.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    await store.destroy()
    expect(store.isInitialized).toBeFalsy()
  })

  it(`should set the store to "destroyed" state.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    await store.destroy()
    expect(store.storeTag).toBe(StoreTags.destroyed)
    expect(store[`_lastAction`]).toBe(Actions.destroy)
    expect(store.isDestroyed).toBeTruthy()
  })

  it(`should set the store's state value to null.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.value).not.toBeNull()
    await store.destroy()
    expect(store.value).toBeNull()
  })

  it(`should set the store's initial value to null.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.initialValue).not.toBeNull()
    await store.destroy()
    expect(store.initialValue).toBeNull()
  })

  it(`should set the store's instanced value to null.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.instancedValue).not.toBeNull()
    await store.destroy()
    expect(store.instancedValue).toBeNull()
  })

  it(`should set the store's error to null.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    store.error = new Error(`Some error`)
    await store.destroy()
    expect(store.error).toBeNull()
  })

  it(`should set the store's paused state to false.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    store.isPaused = true
    await store.destroy()
    expect(store.isPaused).toBeFalsy()
  })

  it(`should remove related local storage data if any.`, async () => {
    const store = StoresFactory.createStore(createInitialState(), { name: `TEST-STORE`, storageType: Storages.local })
    const storageDebounceTime = store.config.storageDebounceTime
    await timer(storageDebounceTime).toPromise()
    const storageKey = store.config.name
    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify(createInitialState()))
    await store.destroy()
    expect(localStorage.getItem(storageKey)).toBeNull()
  })

  it(`should unsubscribe from state to storage subscription.`, async () => {
    const store = StoresFactory.createStore(createInitialState(), { name: `TEST-STORE`, storageType: Storages.local })
    assertNotNullable(store[`_valueToStorageSub`])
    expect(store[`_valueToStorageSub`]).toBeInstanceOf(Subscription)
    expect(store[`_valueToStorageSub`].closed).toBeFalsy()
    await store.destroy()
    expect(store[`_valueToStorageSub`].closed).toBeTruthy()
  })

  it(`should return store's instance on resolve.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    await expect(store.destroy()).resolves.toBe(store)
  })

  it(`should cancel async initialization if it's in pending state.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    const testSubjectPromise = timer(500).pipe(map(() => createInitialState())).toPromise()
    store.initializeAsync(testSubjectPromise)
    await store.destroy()
    await timer(500).toPromise()
    expect(store.value).toBeNull()
  })

  it(`should cancel and set to null the lazy init context if it exists.`, async () => {
    const store = StoresFactory.createStore(null)
    store.initializeLazily(Promise.resolve(createInitialState()))
    const lazyInitContext = store[`_lazyInitContext`]
    await store.destroy()
    assert(lazyInitContext)
    expect(lazyInitContext.isCanceled).toBeTruthy()
    expect(store[`_lazyInitContext`]).toBeNull()
  })

  it(`should set the store's loading state to false.`, async () => {
    const store = StoresFactory.createStore(null)
    expect(store.isLoading).toBeTruthy()
    await store.destroy()
    expect(store.isLoading).toBeFalsy()
  })

  it(`should not _setState if the store is destroyed.`, async () => {
    const store = StoresFactory.createStore(null)
    await store.destroy()
    store[`_setState`]({ value: { foo: `foo` } }, Actions.update)
    expect(store.value).toBeNull()
  })

  it(`should invoke dispose all on query context list.`, async () => {
    const store = StoresFactory.createStore(null)
    const disposeAllSpy = jest.spyOn(store[`_queryContextsList`], `disposeAll`)
    await store.destroy()
    expect(disposeAllSpy).toBeCalledTimes(1)
  })

  it(`should invoke complete on all store's observables.`, async () => {
    const store = StoresFactory.createStore(null)
    let allObservablesActive = true
    for (const key in store) {
      if (!store.hasOwnProperty(key)) continue
      const prop = store[key]
      if (prop instanceof Subject && prop.isStopped) {
        allObservablesActive = false
        break
      }
    }
    expect(allObservablesActive).toBeTruthy()
    await store.destroy()
    let allObservablesStopped = true
    for (const key in store) {
      if (!store.hasOwnProperty(key)) continue
      const prop = store[key]
      if (prop instanceof Subject && !prop.isStopped) {
        allObservablesStopped = false
        break
      }
    }
    expect(allObservablesStopped).toBeTruthy()
  })

  it(`should remove the store from dev tools adapter.`, async () => {
    LbrXManager.initializeDevTools()
    const store = StoresFactory.createStore(createInitialState())
    const storeName = store.config.name
    expect(DevToolsAdapter.stores[storeName]).toBe(store)
    expect(DevToolsAdapter.states[storeName]).toStrictEqual(store.state)
    expect(DevToolsAdapter.values[storeName]).toStrictEqual(store.value)
    await store.destroy()
    expect(DevToolsAdapter.stores[storeName]).toBeUndefined()
    expect(DevToolsAdapter.states[storeName]).toBeUndefined()
    expect(DevToolsAdapter.values[storeName]).toBeUndefined()
  })
})
