import { LbrXManager as LbrXManager_type } from 'lbrx/internal/core'
import { DevToolsAdapter as DevToolsAdapter_type, DevToolsManager as DevToolsManager_type } from 'lbrx/internal/dev-tools'
import { StoresFactory as StoresFactory_type } from '__test__/factories'
import MockBuilder from '__test__/mock-builder'

describe(`Dev Tools Manager - initialize():`, () => {

  let DevToolsManager: typeof DevToolsManager_type
  let LbrXManager: typeof LbrXManager_type
  let StoresFactory: typeof StoresFactory_type
  let DevToolsAdapter: typeof DevToolsAdapter_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    DevToolsManager = provider.DevToolsManager
    LbrXManager = provider.LbrXManager
    StoresFactory = provider.StoresFactory
    DevToolsAdapter = provider.DevToolsAdapter
    MockBuilder.addWindowMock()
      .addReduxDevToolsExtensionMock()
      .buildMocks()
  })

  it(`should initialize by default.`, () => {
    const devTools = new DevToolsManager()
    devTools.initialize()
    expect(DevToolsManager[`_wasInitialized`]).toBeTruthy()
  })

  it(`should not initialize in production mode.`, () => {
    LbrXManager.enableProdMode()
    const devTools = new DevToolsManager()
    devTools.initialize()
    expect(DevToolsManager[`_wasInitialized`]).toBeFalsy()
  })

  it(`should not initialize if not running on browser.`, () => {
    MockBuilder.deleteAllMocks()
    MockBuilder.addReduxDevToolsExtensionMock()
      .buildMocks()
    const devTools = new DevToolsManager()
    devTools.initialize()
    expect(DevToolsManager[`_wasInitialized`]).toBeFalsy()
  })

  it(`should not initialize if there is no redux devtools extension.`, () => {
    MockBuilder.deleteAllMocks()
    MockBuilder.addWindowMock()
      .buildMocks()
    const devTools = new DevToolsManager()
    devTools.initialize()
    expect(DevToolsManager[`_wasInitialized`]).toBeFalsy()
  })

  it(`should not initialize if was initialized before.`, () => {
    const devTools = new DevToolsManager()
    devTools.initialize()
    const lbrxGlobalObject = globalThis.$$LbrX
    expect(globalThis.$$LbrX).toBe(lbrxGlobalObject)
  })

  it(`should log warning if one or more stores were created before dev tools initialization.`, () => {
    StoresFactory.createStore({})
    const consoleWarnSpy = jest.spyOn(console, `warn`).mockImplementation()
    const devTools = new DevToolsManager()
    devTools.initialize()
    expect(consoleWarnSpy).toBeCalledTimes(1)
  })

  it(`should create an global object that contains DevToolsAdapter's properties. (Observables excluded)`, () => {
    const devTools = new DevToolsManager()
    devTools.initialize()
    expect(Object.keys(globalThis.$$LbrX).length).toBe(3)
    expect(globalThis.$$LbrX.$$stores).toBe(DevToolsAdapter.stores)
    expect(globalThis.$$LbrX.$$states).toBe(DevToolsAdapter.states)
    expect(globalThis.$$LbrX.$$values).toBe(DevToolsAdapter.values)
  })

  it(`should add partial states to history and values as state if displayValueAsState config is set.`, () => {
    const devTools = new DevToolsManager({ displayValueAsState: true })
    const addPartialStatesToHistorySpy = jest.spyOn(devTools as any, `_addPartialStatesToHistory`)
    devTools.initialize()
    expect(addPartialStatesToHistorySpy).toBeCalledTimes(1)
  })
})
