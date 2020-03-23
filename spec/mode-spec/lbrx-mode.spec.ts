
describe('lbrx-mode:', () => {

	let enableProdMode: () => void
	let isDev: () => boolean

	beforeEach(async () => {
		const lbrxModes = await import('lbrx/mode')
		enableProdMode = lbrxModes.enableProdMode
		isDev = lbrxModes.isDev
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should be in development mode by default.', () => {
		expect(isDev()).toBeTruthy()
	})

	it('should be in production mode after enabling it.', () => {
		enableProdMode()
		expect(isDev()).toBeFalsy()
	})
})
