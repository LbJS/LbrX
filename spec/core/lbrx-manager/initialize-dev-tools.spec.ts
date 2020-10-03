import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import MockBuilder from '__test__/mock-builder'

describe('LbrXManager setGlobalStoreConfig():', () => {

  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const providerModule = await import('provider')
    LbrXManager = providerModule.LbrXManager
    MockBuilder.addReduxDevToolsExtensionMock()
      .buildMocks()
  })

  afterEach(() => {
    MockBuilder.deleteAllMocks()
    jest.resetModules()
  })

  it('should initialize set Redux DevTools configurations.', () => {
    const devToolsOptions = { name: 'NEW-NAME' }
    const expectedValue = {
      name: 'NEW-NAME',
      maxAge: 50,
    }
    LbrXManager.initializeDevTools(devToolsOptions)
    expect((window as any).__REDUX_DEVTOOLS_EXTENSION__.config).toStrictEqual(expectedValue)
  })

  it('should return LbrXManager.', () => {
    const value = LbrXManager.initializeDevTools()
    expect(value).toStrictEqual(LbrXManager)
  })
})
