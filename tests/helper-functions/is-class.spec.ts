import { isClass } from "../../lbrx/src/helpers"

describe('Helper Function - isClass():', () => {

	it(`Class's object should be identified as constructable`, () => {
		class Person { }
		const person = new Person()
		expect(isClass(person)).toBeTruthy()
	})

	it('Plain object should not be identified as constructable', () => {
		const plainObject = {}
		expect(isClass(plainObject)).toBeFalsy()
	})
})
