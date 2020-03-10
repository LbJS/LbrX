import { Person, BetterPerson } from "../test-subjects"
import { countObjectChanges } from "../../lbrx/src/helpers"

describe('Helper Function - countObjectChanges():', () => {

	const expectedChanges = 13

	it(`should count ${expectedChanges} changes.`, () => {
		const person1 = new Person({
			firstName: 'some name',
			lastName: 'some name',
			address: {
				city: 'some city',
				country: 'some country',
				region: 'some region',
				homeNumber: 6,
			},
			birthday: new Date(2000, 0, 1),
			someDate: new Date(2000, 0, 1),
			nestedObject: {
				nestedValue: {
					randomList: [
						'string',
						5,
						{
							test: 'test',
							n: null
						},
						[
							1, 2, 3
						]
					]
				}
			}
		})
		const person2 = new BetterPerson({
			firstName: 'some name',
			lastName: 'some other name',
			address: {
				city: 'some city',
				country: null,
				homeNumber: '6',
			},
			birthday: new Date(2000, 0, 1),
			someDate: new Date(2000, 0, 2),
			someOtherDate: new Date(2000, 0, 5),
			betterDate: new Date(),
			nestedObject: {
				nestedValue: {
					randomList: [
						'string',
						'5',
						{
							test: 'test',
							n: new Date()
						},
						[
							1, 3, 2, 5, 6
						]
					]
				}
			}
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChanges)
	})
})
