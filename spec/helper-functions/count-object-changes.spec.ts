import { Person, BetterPerson } from '../test-subjects'
import { countObjectChanges } from 'lbrx/helpers'

describe('Helper Function - countObjectChanges():', () => {

	const expectedChangesA = 1
	it(`should count ${expectedChangesA} changes between two objects. {testId: 1}`, () => {
		const person1 = new Person({
			firstName: 'some name',
			lastName: 'some name',
		})
		const person2 = new Person({
			firstName: 'some name',
			lastName: 'some other name',
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesA)
	})

	const expectedChangesB = 3
	it(`should count ${expectedChangesB} changes between two objects. {testId: 2}`, () => {
		const person1 = new Person({
			address: {
				city: 'some city',
				country: 'some country',
				region: 'some region',
				homeNumber: 6,
			},
		})
		const person2 = new Person({
			address: {
				city: 'some city',
				country: null,
				homeNumber: '6',
			},
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesB)
	})

	const expectedChangesC = 3
	it(`should count ${expectedChangesC} changes between two objects. {testId: 3}`, () => {
		const person1 = new Person({
			birthday: new Date(2000, 0, 1),
			someDate: new Date(2000, 0, 1),
		})
		const person2 = new BetterPerson({
			birthday: new Date(2000, 0, 1),
			someDate: new Date(2000, 0, 2),
			someOtherDate: new Date(2000, 0, 5),
			betterDate: new Date(),
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesC)
	})

	const expectedChangesD = 2
	it(`should count ${expectedChangesD} changes between two objects. {testId: 4}`, () => {
		const person1 = new Person({
			nestedObject: {
				nestedValue: {
					randomList: [
						'string',
						5,
						{
							test: 'test',
							n: null
						},
					]
				}
			}
		})
		const person2 = new Person({
			nestedObject: {
				nestedValue: {
					randomList: [
						'string',
						'5',
						{
							test: 'test',
							n: new Date()
						},
					]
				}
			}
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesD)
	})

	const expectedChangesE = 4
	it(`should count ${expectedChangesE} changes between two objects. {testId: 5}`, () => {
		const person1 = new Person({
			nestedObject: {
				nestedValue: {
					randomList: [
						[
							1, 2, 3
						]
					]
				}
			}
		})
		const person2 = new Person({
			nestedObject: {
				nestedValue: {
					randomList: [
						[
							1, 3, 2, 5, 6
						]
					]
				}
			}
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesE)
	})

	const expectedChangesF = 1
	it(`should count ${expectedChangesF} changes between two objects. {testId: 6}`, () => {
		const person1 = new Person({
			nestedObject: {
				nestedValue: {
					randomList: [
						[
							{
								a: new Date(1900),
								b: new Date(),
							}
						]
					]
				}
			}
		})
		const person2 = new Person({
			nestedObject: {
				nestedValue: {
					randomList: [
						[
							{
								a: new Date(1900),
								b: new Date(1700),
							}
						]
					]
				}
			}
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesF)
	})

	const expectedChangesG = 13
	it(`should count ${expectedChangesG} changes between two objects. {testId: 7}`, () => {
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
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesG)
	})

	const expectedChangesH = 0
	it(`should count ${expectedChangesH} changes between two objects. {testId: 8}`, () => {
		const person1 = new Person({
			func: () => { }
		})
		const person2 = new Person({
			func: () => { }
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesH)
	})

	const expectedChangesI = 1
	it(`should count ${expectedChangesI} changes between two objects. {testId: 9}`, () => {
		const person1 = new Person({
			func: () => { },
			nestedObject: {
				nestedValue: {
					randomList: [
						() => { },
						() => { },
					]
				}
			}
		})
		const person2 = new Person({
			func: () => { },
			nestedObject: {
				nestedValue: {
					randomList: [
						() => { },
					]
				}
			}
		})
		expect(countObjectChanges(person1, person2)).toBe(expectedChangesI)
	})
})
