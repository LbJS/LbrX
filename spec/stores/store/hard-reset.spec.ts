import { StoresFactory as StoresFactory_type, TestSubjectFactory } from 'helpers/factories'
import { assertNotNullable } from 'helpers/functions'
import MockBuilder from 'helpers/mock-builder'
import { TestSubject } from 'helpers/test-subjects'
import { LbrXManager as LbrXManager_type, Storages, Store } from 'lbrx'
import { DevToolsSubjects as DevToolsSubjects_type } from 'lbrx/dev-tools'
import { getDefaultStoreOptions } from 'lbrx/stores/config'
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
    expect(store.value).not.toBeNull()
    await store.hardReset()
    expect(store.value).toBeNull()
  })

  it("should set the store's initial value to null.", async () => {
    expect(store.initialValue).not.toBeNull()
    await store.hardReset()
    expect(store.initialValue).toBeNull()
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
  }, getDefaultStoreOptions().storageDebounceTime)

  it('should unsubscribe from state to storage subscription.', async () => {
    storeWithLocalStorage = StoresFactory.createStore(createInitialState(), STORE_WITH_LOCAL_STORAGE_CONFIG)
    assertNotNullable(storeWithLocalStorage['_stateToStorageSub'])
    expect(storeWithLocalStorage['_stateToStorageSub']).toBeInstanceOf(Subscription)
    expect(storeWithLocalStorage['_stateToStorageSub'].closed).toBeFalsy()
    await storeWithLocalStorage.hardReset()
    expect(storeWithLocalStorage['_stateToStorageSub'].closed).toBeTruthy()
  })

  it("should return store's instance on resolve.", async () => {
    const storesInstance = await store.hardReset()
    expect(storesInstance).toBe(store)
  })

  it("should cancel async initialization if it's in pending state.", async () => {
    const asyncTime = 500
    const testSubjectPromise = timer(asyncTime).pipe(map(() => createInitialState())).toPromise()
    asyncStore.initializeAsync(testSubjectPromise)
    await asyncStore.hardReset()
    await timer(500).toPromise()
    expect(asyncStore.value).toBeNull()
  })

  it.todo('errors tests')

  // it('should throw if the store is in loading state and in development mode.', () => {
  //   store.isLoading = true
  //   expect(() => {
  //     store.reset()
  //   }).toThrow()
  // })

  // it('should log an error if the store is in loading state and in production mode.', () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error')
  //     .mockImplementationOnce(() => { })
  //   LbrXManager.enableProdMode()
  //   store.update(createStateA())
  //   store.isLoading = true
  //   expect(() => {
  //     store.reset()
  //   }).not.toThrow()
  //   expect(consoleErrorSpy).toBeCalledTimes(1)
  //   expect(store.value).toStrictEqual(createStateA())
  // })

  // it("should throw if the store is not resettable and it's development mode.", () => {
  //   expect(() => {
  //     notResettableStore.reset()
  //   }).toThrow()
  // })

  // it("should log an error if the store is not resettable and it's production mode.", () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error')
  //     .mockImplementationOnce(() => { })
  //   LbrXManager.enableProdMode()
  //   notResettableStore.update(createStateA())
  //   expect(() => {
  //     notResettableStore.reset()
  //   }).not.toThrow()
  //   expect(consoleErrorSpy).toBeCalledTimes(1)
  //   expect(notResettableStore.value).toStrictEqual(createStateA())
  // })

  // it("should throw if there is no initial state and it's development mode.", () => {
  //   (store as any)._initialState = null
  //   expect(() => {
  //     store.reset()
  //   }).toThrow()
  // })

  // it("should log an error if there is no initial state and it's production mode.", () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error')
  //     .mockImplementationOnce(() => { })
  //   LbrXManager.enableProdMode()
  //   store.update(createStateA());
  //   (store as any)._initialState = null
  //   expect(() => {
  //     store.reset()
  //   }).not.toThrow()
  //   expect(consoleErrorSpy).toBeCalledTimes(1)
  //   expect(store.value).toStrictEqual(createStateA())
  // })

  // it("should reset the store's state to its initial value with different reference.", () => {
  //   store.update(createStateA())
  //   store.reset()
  //   expect(store.value).not.toBe(store.initialValue)
  // })

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
