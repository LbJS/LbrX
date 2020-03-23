import { cloneObject } from 'lbrx/helpers'

describe('Helper Function - cloneObject():', () => {

	it('should set different references. {testId: 1}', () => {
		const objA = {}
		const objB = cloneObject(objA)
		expect(objA).not.toBe(objB)
	})

	it('should set different references. {testId: 2}', () => {
		const objA = {
			date: new Date(2020, 0)
		}
		const objB = cloneObject(objA)
		expect(objA.date).not.toBe(objB.date)
	})

	it('should set different references. {testId: 3}', () => {
		const objA = {
			list: [1, 2, 3]
		}
		const objB = cloneObject(objA)
		expect(objA.list).not.toBe(objB.list)
	})

	it('should set different references. {testId: 4}', () => {
		const objA = {
			list: [
				{
					nestedList: []
				}
			]
		}
		const objB = cloneObject(objA)
		expect(objA.list[0].nestedList).not.toBe(objB.list[0].nestedList)
	})

	it('should set different references. {testId: 5}', () => {
		const objA = {
			list: [
				{
					nestedObj: {
						dates: [
							new Date(2020, 0)
						]
					}
				}
			]
		}
		const objB = cloneObject(objA)
		expect(objA.list[0].nestedObj.dates[0]).not.toBe(objB.list[0].nestedObj.dates[0])
	})

	it('should copy all properties', () => {
		class Person { }
		const objA = {
			a: 'a',
			b: 2,
			c: null,
			arr: [1, 2, 3],
			date: new Date(2020, 0),
			nested: {
				nested: 'x',
				person: new Person()
			}
		}
		const objB = cloneObject(objA)
		expect(objA).toEqual(objB)
	})
})
