import { LbrXManager as LbrXManager_type } from 'lbrx'
import { DevToolsManager } from 'lbrx/dev-tools'
import MockBuilder from 'mock-builder'

describe('LbrXManager setDevToolsZone():', () => {

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

  it('should return LbrXManager.', () => {
    LbrXManager.initializeDevTools()
    const value = LbrXManager.setDevToolsZone({ run: f => f() })
    expect(value).toStrictEqual(LbrXManager)
  })

  it('should set the zone with run function to DevToolsManager.', () => {
    const zone: { run: <T = void>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]) => T } = { run: f => f() }
    LbrXManager.initializeDevTools()
    LbrXManager.setDevToolsZone(zone)
    const devToolsManager = LbrXManager['_devToolsManager'] as DevToolsManager
    expect(devToolsManager['_zone']).toBe(zone)
    const runSpy = jest.spyOn(zone, 'run')
    devToolsManager['_zone'].run(() => { })
    expect(runSpy).toBeCalled()
  })

  it("should log error if DevTools haven't been initialized before calling set DevTools zone.", () => {
    const consoleErrorSpy = jest.spyOn(globalThis.console, 'error').mockImplementation(() => jest.fn())
    const zone: { run: <T = void>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]) => T } = { run: f => f() }
    LbrXManager.setDevToolsZone(zone)
    expect(consoleErrorSpy).toBeCalled()
  })
})
