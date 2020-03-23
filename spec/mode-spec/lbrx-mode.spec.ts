import { isDev, enableProdMode } from 'lbrx/mode'

describe('lbrx-mode:', () => {

	it('should be in development mode by default.', () => {
		expect(isDev()).toBeTruthy()
	})

	it('should be in production mode after enabling it.', () => {
		enableProdMode()
		expect(isDev()).toBeFalsy()
	})
})
