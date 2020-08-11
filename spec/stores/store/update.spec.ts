import { TestSubjectFactory } from 'helpers/factories'
import MockBuilder from 'helpers/mock-builder'
import { TestSubject } from 'helpers/test-subjects'
import { LbrXManager as LbrXManager_type, Store } from 'lbrx'
import { DevToolsSubjects as DevToolsSubjects_type } from 'lbrx/dev-tools'


describe('Store update():', () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let LbrXManager: typeof LbrXManager_type
  let DevToolsSubjects: typeof DevToolsSubjects_type
  let store: Store<TestSubject>
  let asyncStore: Store<TestSubject>
  let partialState: Partial<TestSubject>


  beforeEach(async () => {
    const provider = await import('provider')
    store = provider.StoresFactory.createStore(createInitialState())
    asyncStore = provider.StoresFactory.createStore<TestSubject>(null, 'ASYNC-STORE')
    LbrXManager = provider.LbrXManager
    DevToolsSubjects = provider.DevToolsSubjects
    partialState = { stringValue: 'some other string' }
  })

  it("should update the store's state.", () => {
    expect(store.state).toStrictEqual(createInitialState())
    store.update(partialState)
    const expectedState = createInitialState()
    expectedState.stringValue = partialState.stringValue!
    expect(store.state).toStrictEqual(expectedState)
  })

  it("should throw if the state's value is `null`.", () => {
    (store as any)._state = null
    expect(store.state).toBeNull()
    expect(() => {
      store.update(partialState)
    }).toThrow()
  })

  it("should throw if the store is in 'LOADING' state and it's in development mode.", () => {
    store.isLoading = true
    expect(() => {
      store.update(partialState)
    }).toThrow()
    expect(store.state).toStrictEqual(createInitialState())
  })

  it("should log an error if the store is in 'LOADING' state and it's in production mode.", () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => { })
    LbrXManager.enableProdMode()
    store.isLoading = true
    expect(() => {
      store.update(partialState)
    }).not.toThrow()
    expect(consoleErrorSpy).toBeCalledTimes(1)
    expect(store.state).toStrictEqual(createInitialState())
  })

  it("should throw if the store wasn't initialized and it's in development mode.", () => {
    asyncStore.isLoading = false
    expect(() => {
      asyncStore.update(partialState)
    }).toThrow()
    expect(asyncStore.state).toBeNull()
  })

  it("should log an error if the store wasn't initialized and it's in production mode.", () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => { })
    LbrXManager.enableProdMode()
    asyncStore.isLoading = false
    expect(() => {
      asyncStore.update(partialState)
    }).not.toThrow()
    expect(consoleErrorSpy).toBeCalledTimes(1)
    expect(asyncStore.state).toBeNull()
  })

  it('should distribute update event to DevToolsSubjects.', async done => {
    MockBuilder.addWindowMock()
      .addReduxDevToolsExtensionMock()
      .buildMocks()
    LbrXManager.initializeDevTools()
    DevToolsSubjects.updateEvent$.subscribe(eventData => {
      const expectedEventData = {
        name: store.config.name,
        state: JSON.parse(JSON.stringify(createInitialState()))
      }
      expectedEventData.state.stringValue = partialState.stringValue
      expect(eventData).toStrictEqual(expectedEventData)
      done()
    })
    store.update(partialState)
  })
})
