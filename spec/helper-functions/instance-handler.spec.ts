import { parse, stringify, instanceHandler, isDate } from 'lbrx/helpers'
import { Person, Address } from '../test-subjects'

describe('Helper Function - instanceHandler():', () => {

	const simpleCopy = <T extends object>(obj: T): T => {
		return parse(stringify(obj))
	}

	it('should create instance for plain object.', () => {
		const person = new Person({
			firstName: 'leon'
		})
		const personCopy = instanceHandler(person, simpleCopy(person))
		expect(personCopy instanceof Person).toBeTruthy()
	})

	it('should create instance for nested plain object.', () => {
		const person = new Person({
			firstName: 'leon',
			address: new Address({
				city: 'super city'
			})
		})
		const personCopy = instanceHandler(person, simpleCopy(person))
		expect(personCopy.address instanceof Address).toBeTruthy()
	})

	it('should create instance for date.', () => {
		const person = new Person({
			someDate: new Date()
		})
		const personCopy = instanceHandler(person, simpleCopy(person))
		expect(isDate(personCopy.someDate)).toBeTruthy()
	})
})
