import { LbrXManager as LbrXManager_type } from 'lbrx'
import { isDev as isDevFunc } from 'lbrx/mode'

describe('LbrXManager enableProdMode():', () => {


	let LbrXManager: typeof LbrXManager_type
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		LbrXManager = provider.provide(LbrXManager_type.name)
		isDev = provider.provide(isDevFunc.name)
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
