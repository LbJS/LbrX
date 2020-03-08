import { deepFreeze } from "../../lbrx/src/helpers"

describe('Helper Function - deepFreeze():', () => {

	class Person {
		public firstName = 'Leon'
		private _lastName = 'Bernstein'
		public get lastName(): string {
			return this._lastName
		}
		public set lastName(value: string) {
			this._lastName = value
		}
	}
	let person: Person

	beforeEach(() => {
		person = new Person()
		deepFreeze(person)
	})

	it(`Object's firstName property should be read only`, () => {
		expect(() => {
			person.firstName = 'Something Else'
		}).toThrow()
	})

	it(`Object's lastName property should be read only`, () => {
		expect(() => {
			person.lastName = 'Something Else'
		}).toThrow()
	})
})
