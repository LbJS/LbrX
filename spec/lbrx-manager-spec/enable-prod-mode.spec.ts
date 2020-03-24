import { LbrXManager as LbrXManager_class } from 'lbrx'

describe('LbrXManager enableProdMode():', () => {
	type LbrXManager_type = typeof LbrXManager_class
	type lbrxModule = typeof import('lbrx')
	type modeModule = typeof import('lbrx/mode')

	let LbrXManager: LbrXManager_type
	let isDev: () => boolean

	beforeEach(async () => {
		const [lbrx, lbrxModes]: [lbrxModule, modeModule] = await Promise.all([import('lbrx'), import('lbrx/mode')])
		LbrXManager = lbrx.LbrXManager
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
