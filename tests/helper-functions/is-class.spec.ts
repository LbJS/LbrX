import { isClass } from '../../lbrx/src/helpers'

describe('Helper function: isClass', () => {

	it('Should be constructable', () => {
		class Person { }
		const person = new Person()
		expect(isClass(person)).toBeTruthy()
	})

	it('Should not be constructable', () => {
		expect(isClass({})).toBeFalsy()
	})
})
