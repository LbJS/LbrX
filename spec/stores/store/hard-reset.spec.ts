import { StoresFactory as StoresFactory_type, TestSubjectFactory } from 'helpers/factories'
import { assertNotNullable } from 'helpers/functions'
import MockBuilder from 'helpers/mock-builder'
import { TestSubject } from 'helpers/test-subjects'
import { LbrXManager as LbrXManager_type, Storages, Store } from 'lbrx'
import { DevToolsSubjects as DevToolsSubjects_type } from 'lbrx/dev-tools'
import { getDefaultStoreConfig } from 'lbrx/stores/config'
import { Subscription as Subscription_type, timer } from 'rxjs'
import { map } from 'rxjs/operators'

describe('Store hardReset():', () => {

  const STORE_WITH_LOCAL_STORAGE_CONFIG = {
    name: 'LOCALE-STORAGE-STORE',
    storageType: Storages.local
  }
  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let store: Store<TestSubject>
  let asyncStore: Store<TestSubject>
  let notResettableStore: Store<TestSubject>
  let storeWithLocalStorage: Store<TestSubject>
  let LbrXManager: typeof LbrXManager_type
  let DevToolsSubjects: typeof DevToolsSubjects_type
  let Subscription: typeof Subscription_type
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    MockBuilder.addLocalStorageMock()
      .addReduxDevToolsExtensionMock()
      .buildMocks()
    const rxjs = await import('rxjs')
    const provider = await import('provider')
    Subscription = rxjs.Subscription
    LbrXManager = provider.LbrXManager
    DevToolsSubjects = provider.DevToolsSubjects
    StoresFactory = provider.StoresFactory
    store = StoresFactory.createStore(createInitialState())
    notResettableStore = StoresFactory.createStore(createInitialState(), {
      name: 'NOT-RESETTABLE-STORE',
      isResettable: false
    })
    asyncStore = StoresFactory.createStore<TestSubject>(null, {
      name: 'ASYNC-STORE',
    })
  })

  it("should set the store's state value to null.", async () => {
    expect(store.state).not.toBeNull()
    await store.hardReset()
    expect(store.state).toBeNull()
  })

  it("should set the store's initial value to null.", async () => {
    expect(store.initialState).not.toBeNull()
    await store.hardReset()
    expect(store.initialState).toBeNull()
  })

  it('should set the loading state to true.', async () => {
    expect(store.isLoading).toBeFalsy()
    await store.hardReset()
    expect(store.isLoading).toBeTruthy()
  })

  it("should set the store's error to null.", async () => {
    store.error = new Error('Some error')
    await store.hardReset()
    expect(store.error).toBeNull()
  })

  it('should remove related local storage data if any.', async () => {
    storeWithLocalStorage = StoresFactory.createStore(createInitialState(), STORE_WITH_LOCAL_STORAGE_CONFIG)
    const storageDebounceTime = storeWithLocalStorage.config.storageDebounceTime
    await timer(storageDebounceTime).toPromise()
    const storageKey = storeWithLocalStorage.config.name
    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify(createInitialState()))
    await storeWithLocalStorage.hardReset()
    expect(localStorage.getItem(storageKey)).toBeNull()
  }, getDefaultStoreConfig().storageDebounceTime)

  it('should unsubscribe from state to storage subscription.', async () => {
    storeWithLocalStorage = StoresFactory.createStore(createInitialState(), STORE_WITH_LOCAL_STORAGE_CONFIG)
    assertNotNullable(storeWithLocalStorage['_stateToStorageSub'])
    expect(storeWithLocalStorage['_stateToStorageSub']).toBeInstanceOf(Subscription)
    expect(storeWithLocalStorage['_stateToStorageSub'].closed).toBeFalsy()
    await storeWithLocalStorage.hardReset()
    expect(storeWithLocalStorage['_stateToStorageSub'].closed).toBeTruthy()
  })

  it("should return store's instance on resolve.", async () => {
    expect.assertions(1)
    await expect(store.hardReset()).resolves.toBe(store)
  })

  it("should cancel async initialization if it's in pending state.", async () => {
    const asyncTime = 500
    const testSubjectPromise = timer(asyncTime).pipe(map(() => createInitialState())).toPromise()
    asyncStore.initializeAsync(testSubjectPromise)
    await asyncStore.hardReset()
    await timer(500).toPromise()
    expect(asyncStore.state).toBeNull()
  })

  it("should throw if the store is not resettable and it's in development mode.", async () => {
    expect.assertions(1)
    await expect(notResettableStore.hardReset()).rejects.toBeInstanceOf(Error)
  })

  it("should log an error if the store is not resettable and it's in production mode.", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => { })
    LbrXManager.enableProdMode()
    expect.assertions(2)
    await expect(notResettableStore.hardReset()).resolves.toBe(notResettableStore)
    expect(consoleErrorSpy).toBeCalledTimes(1)
  })

  it('should distribute hardReset event and then loading event to DevToolsSubjects.', done => {
    LbrXManager.initializeDevTools()
    let waHardResetEvent = false
    DevToolsSubjects.hardResetEvent$.subscribe(eventData => {
      waHardResetEvent = true
      expect(eventData).toBe(store.config.name)
    })
    DevToolsSubjects.loadingEvent$.subscribe(eventData => {
      expect(waHardResetEvent).toBeTruthy()
      expect(eventData).toBe(store.config.name)
      done()
    })
    store.hardReset()
  })
})
