import MockBuilder from 'mock-builder'
import { LbrXManager as LbrXManager_type } from 'lbrx'
import { DevToolsManager as DevToolsManager_type } from 'lbrx/dev-tools'

// tslint:disable: no-string-literal

describe('LbrXManager setDevToolsZone():', () => {

	let LbrXManager: typeof LbrXManager_type

	beforeEach(async () => {
		const provider = (await import('provider')).default
		LbrXManager = provider.provide(LbrXManager_type.name)
		MockBuilder.addReduxDevToolsExtensionMock()
			.buildMocks()
	})

	afterEach(() => {
		MockBuilder.deleteAllMocks()
		jest.resetModules()
	})

	it('should return LbrXManager.', () => {
		const value = LbrXManager.setDevToolsZone({ run: f => f() })
		expect(value).toStrictEqual(LbrXManager)
	})

	it('should set the zone with run function to DevToolsManager.', () => {
		const zone: { run: <T = void>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]) => T } = { run: f => f() }
		LbrXManager.initializeDevTools()
		LbrXManager.setDevToolsZone(zone)
		const DevToolsManager = LbrXManager['_devToolsManager'] as DevToolsManager_type
		expect(DevToolsManager['_zone']).toBe(zone)
		const runSpy = jest.spyOn(zone, 'run')
		DevToolsManager['_zone'].run(() => { })
		expect(runSpy).toBeCalled()
	})
})
