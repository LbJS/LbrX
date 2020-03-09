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
		public emails: string[] = [
			'test@email.com'
		]
	}
	let person: Person

	beforeEach(() => {
		person = new Person()
		deepFreeze(person)
	})

	it(`Object's firstName property should throw on modification`, () => {
		expect(() => {
			person.firstName = 'Something Else'
		}).toThrow()
	})

	it(`Object's lastName property should throw on modification`, () => {
		expect(() => {
			person.lastName = 'Something Else'
		}).toThrow()
	})

	it(`Object's emails list should throw throw on adding a new item`, () => {
		expect(() => {
			person.emails.push('newEmail@email.com')
		}).toThrow()
	})

	it(`Object's emails list should throw on item's modification`, () => {
		expect(() => {
			person.emails[0] = 'newEmail@email.com'
		}).toThrow()
	})
})
