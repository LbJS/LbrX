import { LbrXManager as LbrXManager_type } from 'lbrx/internal/core'
import { DevToolsAdapter as DevToolsAdapter_type, DevToolsManager as DevToolsManager_type } from 'lbrx/internal/dev-tools'
import { getDefaultDevToolsConfig as getDefaultDevToolsConfig_type } from 'lbrx/internal/dev-tools/config'
import { StoresFactory as StoresFactory_type } from '__test__/factories'
import MockBuilder from '__test__/mock-builder'

describe(`Dev Tools Manager - constructor():`, () => {

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

  it(`should set the default configuration on construction.`, () => {
    const devTools = new DevToolsManager()
    expect(devTools[`_devToolsOptions`]).toStrictEqual(getDefaultDevToolsConfig())
  })

  it(`should merge the provided configuration with the default configuration on construction.`, () => {
    const devTools = new DevToolsManager({ name: `OTHER-NAME` })
    const defaultConfig = getDefaultDevToolsConfig()
    defaultConfig.name = `OTHER-NAME`
    expect(devTools[`_devToolsOptions`]).toStrictEqual(defaultConfig)
  })
})
