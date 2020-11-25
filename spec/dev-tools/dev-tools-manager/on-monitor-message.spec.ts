import { LbrXManager as LbrXManager_type } from 'lbrx/internal/core'
import { DevToolsAdapter as DevToolsAdapter_type, DevToolsManager as DevToolsManager_type, ReduxDevToolsMessage, ReduxDevToolsMonitor } from 'lbrx/internal/dev-tools'
import { getDefaultDevToolsConfig as getDefaultDevToolsConfig_type } from 'lbrx/internal/dev-tools/config'
import { getDefaultState } from 'lbrx/internal/stores/store-accessories'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import MockBuilder from '__test__/mock-builder'
import { TestSubject } from '__test__/test-subjects'
import { DeepPartial } from '__test__/types'


describe(`Dev Tools Manager - on monitor message:`, () => {
  type ReduxDevToolsMonitorWithEmit = ReduxDevToolsMonitor & { emitMsg: (message: DeepPartial<ReduxDevToolsMessage>) => void }

  let DevToolsManager: typeof DevToolsManager_type
  let LbrXManager: typeof LbrXManager_type
  let StoresFactory: typeof StoresFactory_type
  let DevToolsAdapter: typeof DevToolsAdapter_type
  let getDefaultDevToolsConfig: typeof getDefaultDevToolsConfig_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    DevToolsManager = provider.DevToolsManager
    LbrXManager = provider.LbrXManager
    StoresFactory = provider.StoresFactory
    DevToolsAdapter = provider.DevToolsAdapter
    getDefaultDevToolsConfig = provider.getDefaultDevToolsConfig
    MockBuilder.addWindowMock()
      .addReduxDevToolsExtensionMock()
      .buildMocks()
  })

  it(`should ignore a non dispatch type messages.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    const initSpy = jest.spyOn(reduxMonitor, `init`)
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    devtoolsManager[`_pauseRecording`] = `TEST` as any as boolean
    reduxMonitor.emitMsg({ type: `else` })
    expect(errorSpy).not.toHaveBeenCalled()
    expect(initSpy).not.toHaveBeenCalled()
    expect(setStateSpy).not.toHaveBeenCalled()
    expect(devtoolsManager[`_pauseRecording`]).toBe(`TEST`)
  })

  it(`should reinitialize reduxMonitor if the payload type is COMMIT.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const initSpy = jest.spyOn(reduxMonitor, `init`)
    reduxMonitor.emitMsg({ type: `DISPATCH`, payload: { type: `COMMIT` } })
    expect(initSpy).toBeCalledTimes(1)
  })

  it(`should reinitialize reduxMonitor if the payload type is COMMIT and reinitialize partial state history if so configured.`, () => {
    LbrXManager.initializeDevTools({ displayValueAsState: true })
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const initSpy = jest.spyOn(reduxMonitor, `init`)
    const addPartialStatesToHistorySpy = jest.spyOn(devtoolsManager, `_addPartialStatesToHistory` as any)
    const oldPartialHistory = devtoolsManager[`_partialStateHistory`]
    reduxMonitor.emitMsg({ type: `DISPATCH`, payload: { type: `COMMIT` } })
    expect(initSpy).toBeCalledTimes(1)
    expect(addPartialStatesToHistorySpy).toBeCalledTimes(1)
    expect(devtoolsManager[`_partialStateHistory`]).not.toBe(oldPartialHistory)
  })

  it(`should toggle pause recording if the payload type is PAUSE_RECORDING.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    reduxMonitor.emitMsg({ type: `DISPATCH`, payload: { type: `PAUSE_RECORDING`, status: true } })
    expect(devtoolsManager[`_pauseRecording`]).toBeTruthy()
    reduxMonitor.emitMsg({ type: `DISPATCH`, payload: { type: `PAUSE_RECORDING`, status: false } })
    expect(devtoolsManager[`_pauseRecording`]).toBeFalsy()
  })

  it(`should ignore a message if it's missing a state and the payload type is JUMP_TO_STATE, JUMP_TO_ACTION or TOGGLE_ACTION.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    const initSpy = jest.spyOn(reduxMonitor, `init`)
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    devtoolsManager[`_pauseRecording`] = `TEST` as any as boolean
    reduxMonitor.emitMsg({ type: `DISPATCH`, payload: { type: `JUMP_TO_STATE` } })
    reduxMonitor.emitMsg({ type: `DISPATCH`, payload: { type: `JUMP_TO_ACTION` } })
    reduxMonitor.emitMsg({ type: `DISPATCH`, payload: { type: `TOGGLE_ACTION` } })
    expect(errorSpy).not.toHaveBeenCalled()
    expect(initSpy).not.toHaveBeenCalled()
    expect(setStateSpy).not.toHaveBeenCalled()
    expect(devtoolsManager[`_pauseRecording`]).toBe(`TEST`)
  })

  it(`should log an error to reduxMonitor if it's a TOGGLE_ACTION.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: `{}`, payload: { type: `TOGGLE_ACTION` } })
    expect(errorSpy).toBeCalledTimes(1)
  })

  it(`should ignore if it has a state but it's an unrecognized payload type.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    const initSpy = jest.spyOn(reduxMonitor, `init`)
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    devtoolsManager[`_pauseRecording`] = `TEST` as any as boolean
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: `{}`, payload: { type: `else` } })
    expect(errorSpy).not.toHaveBeenCalled()
    expect(initSpy).not.toHaveBeenCalled()
    expect(setStateSpy).not.toHaveBeenCalled()
    expect(devtoolsManager[`_pauseRecording`]).toBe(`TEST`)
  })

  it(`should call setState if it's a JUMP_TO_STATE payload type.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore({})
    const storeState = store.state
    storeState.value = { foo: `foo` }
    expect(store.state).not.toStrictEqual(storeState)
    const testState = JSON.stringify({ [store.config.name]: storeState })
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_STATE` } })
    expect(setStateSpy).toBeCalledTimes(1)
    expect(zoneRunSpy).toBeCalledTimes(1)
    expect(store.state).toStrictEqual(storeState)
  })

  it(`should call setState if it's a JUMP_TO_ACTION payload type.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore({})
    const storeState = store.state
    storeState.value = { foo: `foo` }
    expect(store.state).not.toStrictEqual(storeState)
    const testState = JSON.stringify({ [store.config.name]: storeState })
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_ACTION` } })
    expect(setStateSpy).toBeCalledTimes(1)
    expect(zoneRunSpy).toBeCalledTimes(1)
    expect(store.state).toStrictEqual(storeState)
  })

  it(`should not call setState if it's a JUMP_TO_STATE payload type but the store is not found in the DevToolsAdapter.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore({})
    const storeState = store.state
    storeState.value = { foo: `foo` }
    expect(store.state).not.toStrictEqual(storeState)
    const testState = JSON.stringify({ [store.config.name]: storeState })
    delete DevToolsAdapter.stores[store.config.name]
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_STATE` } })
    expect(setStateSpy).not.toBeCalled()
    expect(zoneRunSpy).not.toBeCalled()
    expect(store.state).not.toStrictEqual(storeState)
  })

  it(`should not call setState if it's a JUMP_TO_ACTION payload type but the store is null in the DevToolsAdapter.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore({})
    const storeState = store.state
    storeState.value = { foo: `foo` }
    expect(store.state).not.toStrictEqual(storeState)
    const testState = JSON.stringify({ [store.config.name]: storeState })
    DevToolsAdapter.stores[store.config.name] = null as any
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_ACTION` } })
    expect(setStateSpy).not.toBeCalled()
    expect(zoneRunSpy).not.toBeCalled()
    expect(store.state).not.toStrictEqual(storeState)
  })

  it(`should set the default state if it's a JUMP_TO_STATE payload type but the store is not a part of redux state.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore({ foo: `foo` })
    const storeState = store.state
    storeState.value = { foo: `foo2` }
    expect(store.state).not.toStrictEqual(storeState)
    const testState = JSON.stringify({ 'SOME-OTHER-STORE': storeState })
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_STATE` } })
    expect(setStateSpy).toBeCalledTimes(1)
    expect(zoneRunSpy).toBeCalledTimes(1)
    expect(store.state).toStrictEqual(getDefaultState())
  })

  // tslint:disable-next-line: max-line-length
  it(`should merge partialStateHistory with the state's value if the payload type is JUMP_TO_ACTION and displayValueAsState is configured.`, () => {
    LbrXManager.initializeDevTools({ displayValueAsState: true })
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore({ foo: `foo` })
    const storeState = store.state
    storeState.value = { foo: `foo2` }
    store.update(storeState.value)
    expect(store.state).toStrictEqual(storeState)
    const testState = JSON.stringify({ [store.config.name]: { foo: `foo` } })
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_ACTION`, actionId: 1 } })
    expect(setStateSpy).toBeCalledTimes(1)
    expect(zoneRunSpy).toBeCalledTimes(1)
    const expectedState = getDefaultState()
    expectedState.value = { foo: `foo` }
    expect(store.state).toStrictEqual(expectedState)
  })

  it(`should handle types by default.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore(TestSubjectFactory.createTestSubject_initial())
    const storeState = store.state
    store.update(TestSubjectFactory.createTestSubject_configA())
    expect(store.state).not.toStrictEqual(storeState)
    const testState = JSON.stringify({ [store.config.name]: storeState })
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_STATE` } })
    expect(setStateSpy).toBeCalledTimes(1)
    expect(zoneRunSpy).toBeCalledTimes(1)
    expect(store.value).toStrictEqual(TestSubjectFactory.createTestSubject_initial())
    expect(store.value).toBeInstanceOf(TestSubject)
  })

  it(`should not handle types if class handler is not configured at the store.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore(
      TestSubjectFactory.createTestSubject_initial(),
      { name: `TEST-STORE`, isClassHandler: false }
    )
    const storeState = store.state
    store.update(TestSubjectFactory.createTestSubject_configA())
    expect(store.state).not.toStrictEqual(storeState)
    const testState = JSON.stringify({ [store.config.name]: storeState })
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_STATE` } })
    expect(setStateSpy).toBeCalledTimes(1)
    expect(zoneRunSpy).toBeCalledTimes(1)
    expect(store.value).not.toStrictEqual(TestSubjectFactory.createTestSubject_initial())
    expect(store.value).not.toBeInstanceOf(TestSubject)
    expect(store.value).toStrictEqual(JSON.parse(JSON.stringify(TestSubjectFactory.createTestSubject_initial())))
  })

  it(`should not handle types if instance value is missing at the store.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitorWithEmit = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitorWithEmit
    const setStateSpy = jest.spyOn(devtoolsManager, `_setState` as any)
    const zoneRunSpy = jest.spyOn(devtoolsManager[`_zone`], `run`)
    const store = StoresFactory.createStore(TestSubjectFactory.createTestSubject_initial())
    const storeState = store.state
    store.update(TestSubjectFactory.createTestSubject_configA())
    expect(store.state).not.toStrictEqual(storeState)
    const testState = JSON.stringify({ [store.config.name]: storeState })
    store[`_instancedValue`] = null
    reduxMonitor.emitMsg({ type: `DISPATCH`, state: testState, payload: { type: `JUMP_TO_STATE` } })
    expect(setStateSpy).toBeCalledTimes(1)
    expect(zoneRunSpy).toBeCalledTimes(1)
    expect(store.value).not.toStrictEqual(TestSubjectFactory.createTestSubject_initial())
    expect(store.value).not.toBeInstanceOf(TestSubject)
    expect(store.value).toStrictEqual(JSON.parse(JSON.stringify(TestSubjectFactory.createTestSubject_initial())))
  })
})
