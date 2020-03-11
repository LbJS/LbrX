import { Person } from "../test-subjects"
import { compareObjects } from "../../lbrx/src/helpers"

describe('Helper Function - compareObjects():', () => {

	it(`should return that the objects are equal.`, () => {
		const person1 = new Person({
			firstName: 'Leon'
		})
		const person2 = new Person({
			firstName: 'Leon'
		})
		expect(compareObjects(person1, person2)).toBeTruthy()
	})

	it(`should return that the objects are different.`, () => {
		const person1 = new Person({
			firstName: 'Leon'
		})
		const person2 = new Person({
			firstName: 'Sasha'
		})
		expect(compareObjects(person1, person2)).toBeFalsy()
	})
})
