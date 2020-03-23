import { LbrXManager } from 'lbrx'

describe('LbrXManager constructor:', () => {

	it('should throw on instance creation.', () => {
		expect(() => {
			// tslint:disable-next-line: no-unused-expression
			new LbrXManager()
		}).toThrow()
	})
})
