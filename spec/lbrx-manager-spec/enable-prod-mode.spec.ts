import { LbrXManager } from 'lbrx'
import { isDev as isDevFunc } from 'lbrx/mode'

describe('LbrXManager enableProdMode():', () => {


	let lbrxManager: typeof LbrXManager
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		lbrxManager = provider.provide(LbrXManager.name)
		isDev = provider.provide(isDevFunc.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set isDev to false.', () => {
		lbrxManager.enableProdMode()
		expect(isDev()).toBeFalsy()
	})

	it('should return LbrXManager.', () => {
		const value = lbrxManager.enableProdMode()
		expect(value).toStrictEqual(lbrxManager)
	})
})
