import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { DevToolsManager, ReduxDevToolsExtension } from 'lbrx/internal/dev-tools'
import { ReduxDevToolsOptions } from 'lbrx/internal/dev-tools/config'
import MockBuilder from '__test__/mock-builder'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: ReduxDevToolsExtension
    __REDUX_DEVTOOLS_EXTENSION_config__: ReduxDevToolsOptions
  }
}

describe(`LbrXManager - setGlobalStoreConfig():`, () => {

  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    LbrXManager = provider.LbrXManager
    MockBuilder.addWindowMock()
      .addReduxDevToolsExtensionMock()
      .buildMocks()
  })

  it(`should initialize set Redux DevTools with configurations.`, () => {
    const devToolsOptions = {
      name: `NEW-NAME`,
      maxAge: 50,
    }
    const expectedValue = JSON.parse(JSON.stringify(devToolsOptions))
    LbrXManager.initializeDevTools(devToolsOptions)
    expect(window.__REDUX_DEVTOOLS_EXTENSION_config__).toStrictEqual(expectedValue)
    const devToolsManager = LbrXManager[`_devToolsManager`] as DevToolsManager
    expect(devToolsManager[`_reduxMonitor`]).toBeTruthy()
  })

  it(`should return LbrXManager.`, () => {
    const value = LbrXManager.initializeDevTools()
    expect(value).toStrictEqual(LbrXManager)
  })
})
