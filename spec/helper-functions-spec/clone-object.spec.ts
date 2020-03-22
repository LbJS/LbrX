import { cloneObject } from 'lbrx/helpers'
import { isObjectCloned } from 'helpers'

describe('Helper Function - cloneObject():', () => {

	it('should set different references. {testId: 1}', () => {
		const objA = {}
		const objB = cloneObject(objA)
		expect(isObjectCloned(objA, objB)).toBeTruthy()
	})

	it('should set different references. {testId: 2}', () => {
		const objA = {
			date: new Date()
		}
		const objB = cloneObject(objA)
		expect(isObjectCloned(objA, objB)).toBeTruthy()
	})

	it('should set different references. {testId: 3}', () => {
		const objA = {
			list: [1, 2, 3]
		}
		const objB = cloneObject(objA)
		expect(isObjectCloned(objA, objB)).toBeTruthy()
	})

	it('should set different references. {testId: 4}', () => {
		const objA = {
			list: [
				{
					a: {
						dates: [
							new Date()
						]
					}
				}
			]
		}
		const objB = cloneObject(objA)
		expect(isObjectCloned(objA, objB)).toBeTruthy()
	})

	it('should copy all properties', () => {
		class Person { }
		const objA = {
			a: 'a',
			b: 2,
			c: null,
			arr: [1, 2, 3],
			date: new Date(),
			nested: {
				nested: 'x',
				person: new Person()
			}
		}
		const objB = cloneObject(objA)
		expect(isObjectCloned(objA, objB)).toBeTruthy()
	})
})
