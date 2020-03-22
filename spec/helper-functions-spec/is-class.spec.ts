import { isClass } from 'lbrx/helpers'

describe('Helper Function - isClass():', () => {

	it('should return true for constructable object.', () => {
		class Person { }
		const person = new Person()
		expect(isClass(person)).toBeTruthy()
	})

	it('should return false for plain object.', () => {
		const plainObject = {}
		expect(isClass(plainObject)).toBeFalsy()
	})

	it('should return false for null.', () => {
		expect(isClass(null as unknown as {})).toBeFalsy()
	})

	it('should return false for undefined.', () => {
		expect(isClass(undefined as unknown as {})).toBeFalsy()
	})
})
