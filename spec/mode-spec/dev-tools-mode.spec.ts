import { activateDevToolsPushes as activateDevToolsPushesFunc, isDevTools as isDevToolsFunc } from 'lbrx/mode'


describe('Dev Tools Mode:', () => {

	let activateDevToolsPushes: () => void
	let isDevTools: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		activateDevToolsPushes = provider.provide(activateDevToolsPushesFunc.name)
		isDevTools = provider.provide(isDevToolsFunc.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should deactivated by default.', () => {
		expect(isDevTools()).toBeFalsy()
	})

	it('should activated after enabling pushes.', () => {
		activateDevToolsPushes()
		expect(isDevTools()).toBeTruthy()
	})
})
