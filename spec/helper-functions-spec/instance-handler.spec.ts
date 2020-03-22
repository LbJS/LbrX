import { instanceHandler } from 'lbrx/helpers'
import { Person, Address } from 'test-subjects'

describe('Helper Function - instanceHandler():', () => {

	it('should create instance for plain object.', () => {
		const person = new Person({})
		const personCopy = instanceHandler(person, { firstName: 'Someone' } as Person)
		expect(personCopy).toBeInstanceOf(Person)
	})

	it('should create instance for nested plain object.', () => {
		const person = new Person({
			address: {}
		})
		const personCopy = instanceHandler(person, { address: { city: 'some city' } } as Person)
		expect(personCopy.address).toBeInstanceOf(Address)
	})

	it('should create instance for date.', () => {
		const person = new Person({
			someDate: new Date()
		})
		const personCopy = instanceHandler(person, { someDate: new Date().toJSON() as unknown as Date } as Person)
		expect(personCopy.someDate).toBeInstanceOf(Date)
	})
})
