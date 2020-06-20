import { TestSubjectFactory } from 'helpers/factories'
import MockBuilder from 'helpers/mock-builder'
import { TestSubject } from 'helpers/test-subjects'
import { LbrXManager as LbrXManager_type, Store, StoreConfigOptions } from 'lbrx'
import { DevToolsSubjects as DevToolsSubjects_type } from 'lbrx/dev-tools'

describe('Store reset():', () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  let store: Store<TestSubject>
  let notResettableStore: Store<TestSubject>
  let LbrXManager: typeof LbrXManager_type
  let DevToolsSubjects: typeof DevToolsSubjects_type

  beforeEach(async () => {
    const provider = await import('provider')
    LbrXManager = provider.LbrXManager
    DevToolsSubjects = provider.DevToolsSubjects
    store = provider.StoresFactory.createStore(createInitialState())
    const notResettableStoreConfig: StoreConfigOptions = {
      name: 'NOT-RESETTABLE-STORE',
      isResettable: false
    }
    notResettableStore = provider.StoresFactory.createStore(createInitialState(), notResettableStoreConfig)
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    MockBuilder.deleteAllMocks()
  })

  it("should reset the store's state to its initial value.", () => {
    store.update(createStateA())
    store.reset()
    expect(store.value).toStrictEqual(createInitialState())
  })

  it('should throw if the store is in loading state and in development mode.', () => {
    store.isLoading = true
    expect(() => {
      store.reset()
    }).toThrow()
  })

  it('should log an error if the store is in loading state and in production mode.', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => { })
    LbrXManager.enableProdMode()
    store.update(createStateA())
    store.isLoading = true
    expect(() => {
      store.reset()
    }).not.toThrow()
    expect(consoleErrorSpy).toBeCalledTimes(1)
    expect(store.value).toStrictEqual(createStateA())
  })

  it("should throw if the store is not resettable and it's development mode.", () => {
    expect(() => {
      notResettableStore.reset()
    }).toThrow()
  })

  it("should log an error if the store is not resettable and it's production mode.", () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => { })
    LbrXManager.enableProdMode()
    notResettableStore.update(createStateA())
    expect(() => {
      notResettableStore.reset()
    }).not.toThrow()
    expect(consoleErrorSpy).toBeCalledTimes(1)
    expect(notResettableStore.value).toStrictEqual(createStateA())
  })

  it("should throw if there is no initial state and it's development mode.", () => {
    (store as any)._initialState = null
    expect(() => {
      store.reset()
    }).toThrow()
  })

  it("should log an error if there is no initial state and it's production mode.", () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => { })
    LbrXManager.enableProdMode()
    store.update(createStateA());
    (store as any)._initialState = null
    expect(() => {
      store.reset()
    }).not.toThrow()
    expect(consoleErrorSpy).toBeCalledTimes(1)
    expect(store.value).toStrictEqual(createStateA())
  })

  it("should reset the store's state to its initial value with different reference.", () => {
    store.update(createStateA())
    store.reset()
    expect(store.value).not.toBe(store.initialValue)
  })

  it('should distribute reset event to DevToolsSubjects.', async done => {
    MockBuilder.addWindowMock()
      .addReduxDevToolsExtensionMock()
      .buildMocks()
    LbrXManager.initializeDevTools()
    DevToolsSubjects.resetEvent$.subscribe(eventData => {
      const expectedResetEventData = {
        name: store.config.name,
        state: JSON.parse(JSON.stringify(createInitialState()))
      }
      expect(eventData).toStrictEqual(expectedResetEventData)
      done()
    })
    store.update(createStateA())
    store.reset()
  }, 100)
})
