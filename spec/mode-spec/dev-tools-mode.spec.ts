import { isDevTools, activateDevToolsPushes } from 'lbrx/mode'

describe('dev-tool-mode:', () => {

	it('should deactivated by default.', () => {
		expect(isDevTools()).toBeFalsy()
	})

	it('should activated after enabling pushes.', () => {
		activateDevToolsPushes()
		expect(isDevTools()).toBeTruthy()
	})
})
