
describe('dev-tool-mode:', () => {

	let activateDevToolsPushes: () => void
	let isDevTools: () => boolean

	beforeEach(async () => {
		const lbrxModes = await import('lbrx/mode')
		activateDevToolsPushes = lbrxModes.activateDevToolsPushes
		isDevTools = lbrxModes.isDevTools
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
