import { enableProdMode as enableProdModeFunc, isDev as isDevFunc } from 'lbrx/mode'

describe('LbrX Mode:', () => {

	let enableProdMode: () => void
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		enableProdMode = provider.provide(enableProdModeFunc.name)
		isDev = provider.provide(isDevFunc.name)
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
