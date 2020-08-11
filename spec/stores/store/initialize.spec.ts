import { TestSubjectFactory } from 'helpers/factories'
import { TestSubject } from 'helpers/test-subjects'
import { LbrXManager as LbrXManager_type, Store } from 'lbrx'

describe('Store initialize(): ', () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  const pureInitialState = TestSubjectFactory.createTestSubject_initial()
  const stateA = TestSubjectFactory.createTestSubject_configA()
  let store: Store<TestSubject>
  let loadingStore: Store<TestSubject>
  let LbrXManager: typeof LbrXManager_type
  let isDev: () => boolean

  beforeEach(async () => {
    const provider = await import('provider')
    store = provider.StoresFactory.createStore(initialState)
    loadingStore = provider.StoresFactory.createStore<TestSubject>(null, 'LOADING-STORE')
    LbrXManager = provider.LbrXManager
    isDev = provider.isDev
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should set the initial value as the first state.', () => {
    expect(store.state).toStrictEqual(pureInitialState)
  })

  it("should set the initial value to store's initial value property.", () => {
    expect(store.state).toStrictEqual(store.initialState)
  })

  it('should return the initial state from observable.', done => {
    store.select$().subscribe(value => {
      expect(value).toStrictEqual(pureInitialState)
      done()
    })
  }, 100)

  it('should have null as an initial value.', () => {
    expect(loadingStore.state).toBeNull()
  })

  it('should set the initial value after initialization.', () => {
    loadingStore.initialize(initialState)
    expect(loadingStore.state).toStrictEqual(pureInitialState)
  })

  it('should return the initial state from observable after initialization.', done => {
    loadingStore.select$().subscribe(value => {
      expect(value).toStrictEqual(pureInitialState)
      done()
    })
    loadingStore.initialize(initialState)
  }, 100)

  it('should throw an error on second initialization in development mode.', () => {
    loadingStore.initialize(initialState)
    expect(isDev()).toBeTruthy()
    expect(() => {
      loadingStore.initialize(initialState)
    }).toThrow()
  })

  it('should not throw an error on second initialization in production mode.', () => {
    LbrXManager.enableProdMode()
    loadingStore.initialize(initialState)
    expect(() => {
      loadingStore.initialize(initialState)
    }).not.toThrow()
  })

  it('should not contain second initialization value in production mode.', () => {
    LbrXManager.enableProdMode()
    loadingStore.initialize(initialState)
    loadingStore.initialize(stateA)
    expect(loadingStore.state).toStrictEqual(pureInitialState)
  })

  it('should have value after loading is finished.', done => {
    loadingStore.isLoading$.subscribe(value => {
      if (!value) {
        expect(loadingStore.state).toStrictEqual(pureInitialState)
        done()
      }
    })
    loadingStore.initialize(initialState)
  }, 100)
})
