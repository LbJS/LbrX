import { LbrXManager_Type, LbrXModule, ModeModule } from 'types'

describe('LbrXManager enableProdMode():', () => {


	let LbrXManager: LbrXManager_Type
	let isDev: () => boolean

	beforeEach(async () => {
		const [lbrx, lbrxModes]: [LbrXModule, ModeModule] = await Promise.all([import('lbrx'), import('lbrx/mode')])
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

	it('should return LbrXManager.', () => {
		const value = LbrXManager.enableProdMode()
		expect(value).toStrictEqual(LbrXManager)
	})
})
