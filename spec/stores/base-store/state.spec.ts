import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { getDefaultState } from 'lbrx/internal/stores/store-accessories'
import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - state:`, () => {

  let StoresFactory: typeof StoresFactory_type
  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    LbrXManager = provider.LbrXManager
  })

  it(`should return a cloned state.`, () => {
    const store = StoresFactory.createStore(null, { name: `TEST-STORE` })
    const cloneSpy = jest.spyOn(store, `_clone` as any)
    expect(store.state).toStrictEqual(store[`_stateSource`])
    expect(cloneSpy).toBeCalledTimes(1)
    expect(store.state).not.toBe(store[`_stateSource`])
    expect(cloneSpy).toBeCalledTimes(2)
  })

  it(`should return a cloned state from an observable.`, done => {
    const store = StoresFactory.createStore(null, { name: `TEST-STORE` })
    const cloneSpy = jest.spyOn(store, `_clone` as any)
    store.state$.subscribe(state => {
      expect(state).toStrictEqual(store[`_stateSource`])
      expect(state).not.toBe(store[`_stateSource`])
      expect(cloneSpy).toBeCalledTimes(1)
      done()
    })
  })

  // tslint:disable-next-line: max-line-length
  it(`should log an error if the _state setter is called not from setState method, dev mode is active and stack tracing errors is enabled.`, () => {
    const consoleErrorSpy = jest.spyOn(console, `error`).mockImplementation(jest.fn())
    const store = StoresFactory.createStore({ foo: `foo` }, { name: `TEST-STORE` })
    store[`_state`] = getDefaultState()
    expect(consoleErrorSpy).not.toBeCalled()
    consoleErrorSpy.mockClear()
    LbrXManager.enableStackTracingErrors()
    store[`_state`] = getDefaultState()
    expect(consoleErrorSpy).toBeCalledTimes(1)
    consoleErrorSpy.mockClear()
    LbrXManager.enableProdMode()
    store[`_state`] = getDefaultState()
    expect(consoleErrorSpy).not.toBeCalled()
  })
})
