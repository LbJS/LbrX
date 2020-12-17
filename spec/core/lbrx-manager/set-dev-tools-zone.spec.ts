import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { DevToolsManager } from 'lbrx/internal/dev-tools'
import { ZoneLike } from 'lbrx/internal/types'
import MockBuilder from '__test__/mock-builder'

describe(`LbrXManager - setDevToolsZone():`, () => {

  let LbrXManager: typeof LbrXManager_type
  let zone: ZoneLike

  beforeEach(async () => {
    const providerModule = await import(`provider`)
    LbrXManager = providerModule.LbrXManager
    MockBuilder.addReduxDevToolsExtensionMock()
      .buildMocks()
    zone = { run: f => f() }
  })

  it(`should return LbrXManager.`, () => {
    LbrXManager.initializeDevTools()
    const value = LbrXManager.setDevToolsZone(zone)
    expect(value).toStrictEqual(LbrXManager)
  })

  it(`should set the zone with run function to DevToolsManager.`, () => {
    LbrXManager.initializeDevTools()
    LbrXManager.setDevToolsZone(zone)
    const devToolsManager = LbrXManager[`_devToolsManager`] as DevToolsManager
    expect(devToolsManager[`_zone`]).toBe(zone)
    const runSpy = jest.spyOn(zone, `run`)
    devToolsManager[`_zone`].run(() => { })
    expect(runSpy).toBeCalledTimes(1)
  })

  it(`should log error if DevTools haven't been initialized before calling set DevTools zone.`, () => {
    const consoleErrorSpy = jest.spyOn(globalThis.console, `error`).mockImplementation(() => jest.fn())
    LbrXManager.setDevToolsZone(zone)
    expect(consoleErrorSpy).toBeCalledTimes(1)
  })
})
