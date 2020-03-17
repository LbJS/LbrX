import { isClass } from '../../src/helpers'

describe('Helper Function - isClass():', () => {

	it("should return true for person's (constructable) object.", () => {
		class Person { }
		const person = new Person()
		expect(isClass(person)).toBeTruthy()
	})

	it('should return false for plain object.', () => {
		const plainObject = {}
		expect(isClass(plainObject)).toBeFalsy()
	})
})
