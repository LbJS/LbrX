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
    expect(store.value).toStrictEqual(pureInitialState)
  })

  it("should set the initial value to store's initial value property.", () => {
    expect(store.value).toStrictEqual(store.initialValue)
  })

  it('should return the initial state from observable.', done => {
    store.select$().subscribe(value => {
      expect(value).toStrictEqual(pureInitialState)
      done()
    })
  }, 100)

  it('should have null as an initial value.', () => {
    expect(loadingStore.value).toBeNull()
  })

  it('should set the initial value after initialization.', () => {
    loadingStore.initialize(initialState)
    expect(loadingStore.value).toStrictEqual(pureInitialState)
  })

  it('should return the initial state from observable after initialization.', done => {
    loadingStore.select$().subscribe(value => {
      expect(value).toStrictEqual(pureInitialState)
      done()
    })
    loadingStore.initialize(initialState)
  }, 100)

  it('should throw an error on second initialization.', () => {
    loadingStore.initialize(initialState)
    expect(isDev()).toBeTruthy()
    expect(() => {
      loadingStore.initialize(initialState)
    }).toThrow()
  })

  it('should have value after loading is finished.', done => {
    loadingStore.isLoading$.subscribe(value => {
      if (!value) {
        expect(loadingStore.value).toStrictEqual(pureInitialState)
        done()
      }
    })
    loadingStore.initialize(initialState)
  }, 100)
})
