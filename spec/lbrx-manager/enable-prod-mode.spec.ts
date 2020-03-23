import { LbrXManager } from 'lbrx'
import { isDev } from 'lbrx/mode'

describe('LbrXManager enableProdMode():', () => {

	it('should set isDev to false.', () => {
		LbrXManager.enableProdMode()
		expect(isDev()).toBeFalsy()
	})

	it('should should return LbrXManager.', () => {
		const value = LbrXManager.enableProdMode()
		expect(value).toStrictEqual(LbrXManager)
	})
})
