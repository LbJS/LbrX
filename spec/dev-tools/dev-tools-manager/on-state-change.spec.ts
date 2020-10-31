import { LbrXManager as LbrXManager_type } from 'lbrx/internal/core'
import { DevToolsAdapter as DevToolsAdapter_type, DevToolsManager as DevToolsManager_type, ReduxDevToolsMonitor } from 'lbrx/internal/dev-tools'
import { getDefaultDevToolsConfig as getDefaultDevToolsConfig_type } from 'lbrx/internal/dev-tools/config'
import { StoresFactory as StoresFactory_type } from '__test__/factories'
import { assert } from '__test__/functions'
import MockBuilder from '__test__/mock-builder'

describe(`Dev Tools Manager - constructor():`, () => {

  let initialFoo: {}
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
    initialFoo = {
      foo: `foo`
    }
  })

  it(`should send the state to reduxMonitor when a store is initialized.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    expect(sendSpy).toBeCalledTimes(1)
    expect(devtoolsManager[`_state`][store.config.name]).toStrictEqual(store.state)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
  })

  it(`should send the state to reduxMonitor when a state is updated.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    store.update({ foo: `foo1` })
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    expect(sendSpy).toBeCalledTimes(2)
    expect(devtoolsManager[`_state`][store.config.name]).toStrictEqual(store.state)
  })

  it(`should send the state to reduxMonitor from multiple stores.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    const anotherStore = StoresFactory.createStore({ test: `test` }, `ANOTHER-STORE`)
    expect(action).toBe(`ANOTHER-STORE - ${devtoolsManager[`_storeLastAction`][`ANOTHER-STORE`]}`)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    store.update({ foo: `foo1` })
    expect(sendSpy).toBeCalledTimes(3)
    expect(devtoolsManager[`_state`][store.config.name]).toStrictEqual(store.state)
    expect(devtoolsManager[`_state`][anotherStore.config.name]).toStrictEqual(anotherStore.state)
    expect(DevToolsAdapter.states).toStrictEqual(state)
  })

  it(`should not send the state to reduxMonitor if recording is paused.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    devtoolsManager[`_pauseRecording`] = true
    const anotherStore = StoresFactory.createStore({ test: `test` }, `ANOTHER-STORE`)
    store.update({ foo: `foo1` })
    expect(sendSpy).toBeCalledTimes(1)
    expect(devtoolsManager[`_state`][store.config.name]).not.toStrictEqual(store.state)
    expect(devtoolsManager[`_state`][anotherStore.config.name]).toBeUndefined()
    expect(DevToolsAdapter.states).not.toStrictEqual(state)
  })

  it(`should not send the state to reduxMonitor if the states and the actions are equal.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    store.update(initialFoo)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    store.update(initialFoo)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    expect(sendSpy).toBeCalledTimes(2)
    expect(devtoolsManager[`_state`][store.config.name]).toStrictEqual(store.state)
  })

  it(`should send the state to reduxMonitor if the states and the actions are equal if so was configured.`, () => {
    LbrXManager.initializeDevTools({ logEqualStates: true })
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    store.update(initialFoo)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    store.update(initialFoo)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    expect(state).toStrictEqual(devtoolsManager[`_state`])
    expect(sendSpy).toBeCalledTimes(3)
    expect(devtoolsManager[`_state`][store.config.name]).toStrictEqual(store.state)
  })

  it(`should send the state to reduxMonitor with stack trace if so was configured.`, () => {
    LbrXManager.initializeDevTools({ showStackTrace: true })
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    expect(sendSpy).toBeCalledTimes(1)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state[store.config.name][`action-stack-trace`]).toBeTruthy()
  })

  it(`should not send the state to reduxMonitor with stack trace by default.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    expect(sendSpy).toBeCalledTimes(1)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state[store.config.name][`action-stack-trace`]).toBeFalsy()
  })

  it(`should send the value to reduxMonitor if so configured.`, () => {
    LbrXManager.initializeDevTools({ displayValueAsState: true })
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const store = StoresFactory.createStore(initialFoo)
    expect(sendSpy).toBeCalledTimes(1)
    expect(devtoolsManager[`_state`][store.config.name]).toStrictEqual(store.value)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state[store.config.name]).toStrictEqual(store.value)
  })

  it(`should send the value to reduxMonitor if so configured and do not exceed history max age.`, () => {
    LbrXManager.initializeDevTools({ displayValueAsState: true, maxAge: 3 })
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    const sendSpy = jest.spyOn(reduxMonitor, `send`)
    const store = StoresFactory.createStore(initialFoo)
    store.update({ foo: `foo1` })
    store.update({ foo: `foo2` })
    store.update({ foo: `foo3` })
    expect(sendSpy).toBeCalledTimes(4)
    expect(devtoolsManager[`_state`][store.config.name]).toStrictEqual(store.value)
    expect(devtoolsManager[`_partialStateHistory`][`history`][store.config.name].filter(x => !!x).length).toBe(3)
  })

  it(`should send an error to reduxMonitor if an error is provided.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    const store = StoresFactory.createStore(initialFoo)
    store.error = new Error(`Some error`)
    expect(sendSpy).toBeCalledTimes(2)
    expect(errorSpy).toBeCalledTimes(1)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state[store.config.name].error.message).toBeTruthy()
    expect(state[store.config.name].error.message).toStrictEqual(store.error.message)
  })

  it(`should send an error to reduxMonitor if an error message is provided.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    const store = StoresFactory.createStore(initialFoo)
    store.error = `Some error`
    expect(sendSpy).toBeCalledTimes(2)
    expect(errorSpy).toBeCalledTimes(1)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state[store.config.name].error).toBeTruthy()
    expect(state[store.config.name].error).toStrictEqual(store.error)
  })

  it(`should send an error to reduxMonitor if an error object is provided.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    const store = StoresFactory.createStore(initialFoo)
    store.error = { data: `Some error` }
    expect(sendSpy).toBeCalledTimes(2)
    expect(errorSpy).toBeCalledTimes(1)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state[store.config.name].error).toBeTruthy()
    expect(state[store.config.name].error).toStrictEqual(store.error)
  })

  it(`should send an error to reduxMonitor if an invalid error type provided.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    let action: string | undefined
    let state: {} | undefined
    const sendSpy = jest.spyOn(reduxMonitor, `send`).mockImplementation((ac, st) => {
      action = ac
      state = st
    })
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    const store = StoresFactory.createStore(initialFoo)
    store.error = 123
    expect(sendSpy).toBeCalledTimes(2)
    expect(errorSpy).toBeCalledTimes(1)
    assert(action)
    expect(action).toBe(`${store.config.name} - ${devtoolsManager[`_storeLastAction`][store.config.name]}`)
    assert(state)
    expect(state[store.config.name].error).toBeTruthy()
    expect(state[store.config.name].error).toStrictEqual(store.error)
  })

  it(`should not send the same error twice.`, () => {
    LbrXManager.initializeDevTools()
    const devtoolsManager: DevToolsManager_type = LbrXManager[`_devToolsManager`] as DevToolsManager_type
    const reduxMonitor: ReduxDevToolsMonitor = devtoolsManager[`_reduxMonitor`] as ReduxDevToolsMonitor
    const errorSpy = jest.spyOn(reduxMonitor, `error`)
    const store = StoresFactory.createStore(initialFoo)
    store.update({ foo: `foo1` })
    store.error = new Error(`Some error`)
    store.update({ foo: `foo2` })
    store.update({ foo: `foo3` })
    store.error = new Error(`Some error`)
    store.error = new Error(`Some error1`)
    expect(errorSpy).toBeCalledTimes(2)
  })
})
