import { LbrXManager as LbrXManager_type } from 'lbrx'

describe('LbrXManager enableProdMode():', () => {

	let LbrXManager: typeof LbrXManager_type
	let isDev: () => boolean

	beforeEach(async () => {
		const lbrx = await import('lbrx')
		LbrXManager = lbrx.LbrXManager
		const lbrxModes = await import('lbrx/mode')
		isDev = lbrxModes.isDev
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set isDev to false.', () => {
		LbrXManager.enableProdMode()
		expect(isDev()).toBeFalsy()
	})

	it('should should return LbrXManager.', () => {
		const value = LbrXManager.enableProdMode()
		expect(value).toStrictEqual(LbrXManager)
	})
})
