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
		public address = {
			city: 'Hell of a City'
		}
		public deepNestedObject = {
			a: {
				b: {
					c: 'nested value'
				}
			}
		}
		public birthday = new Date('1986-10-12T00:00:00')
	}
	let person: Person

	beforeEach(() => {
		person = new Person()
		deepFreeze(person)
	})

	it(`should cause person's firstName property to throw on modification.`, () => {
		expect(() => {
			person.firstName = 'Something Else'
		}).toThrow()
	})

	it(`should cause person's lastName property to throw on modification.`, () => {
		expect(() => {
			person.lastName = 'Something Else'
		}).toThrow()
	})

	it(`should cause person's emails list to throw throw on adding a new item.`, () => {
		expect(() => {
			person.emails.push('newEmail@email.com')
		}).toThrow()
	})

	it(`should cause person's emails list to throw on item's modification.`, () => {
		expect(() => {
			person.emails[0] = 'newEmail@email.com'
		}).toThrow()
	})

	it(`should cause person's address to throw on modification.`, () => {
		expect(() => {
			person.address.city = 'some other city'
		}).toThrow()
	})

	it(`should cause person's deep nested value to throw on modification.`, () => {
		expect(() => {
			person.deepNestedObject.a.b.c = 'some other value'
		}).toThrow()
	})

	it(`should cause person's birthday to throw on modification.`, () => {
		expect(() => {
			person.birthday.setFullYear(1987)
		}).toThrow()
	})
})
