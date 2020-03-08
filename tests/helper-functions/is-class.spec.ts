import { isClass } from '../../lbrx/src/helpers'

describe('Helper function: isClass', () => {

	it('Class Object should be constructable', () => {
		class Person { }
		const person = new Person()
		expect(isClass(person)).toBeTruthy()
	})

	it('Object should not be constructable', () => {
		const plainObject = {}
		expect(isClass(plainObject)).toBeFalsy()
	})
})
