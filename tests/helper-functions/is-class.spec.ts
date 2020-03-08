import { isClass } from "../../lbrx/src/helpers"

describe('Helper Function - isClass():', () => {

	it('Class Object should be constructable', () => {
		class Person { }
		const person = new Person()
		expect(isClass(person)).toBeTruthy()
	})

	it('Plain object should not be constructable', () => {
		const plainObject = {}
		expect(isClass(plainObject)).toBeFalsy()
	})
})
