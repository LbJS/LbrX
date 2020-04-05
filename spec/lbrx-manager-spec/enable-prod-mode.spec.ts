import { LbrXManager as LbrXManager_type } from 'lbrx'

describe('LbrXManager enableProdMode():', () => {


	let LbrXManager: typeof LbrXManager_type
	let isDev: () => boolean

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		LbrXManager = providerModule.LbrXManager
		isDev = providerModule.isDev
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set isDev to false.', () => {
		LbrXManager.enableProdMode()
		expect(isDev()).toBeFalsy()
	})

	it('should return LbrXManager.', () => {
		const value = LbrXManager.enableProdMode()
		expect(value).toStrictEqual(LbrXManager)
	})
})
