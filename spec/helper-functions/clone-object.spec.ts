import { compareObjects, isObject } from '../../src/helpers'
import { cloneObject } from '../../src/helpers/helper-functions/clone-object'

describe('Helper Function - cloneObject():', () => {

	const isObjectCloned = (objA: {} | [], objB: {} | []): boolean => {
		if (!compareObjects(objA, objB)) return false
		if (!isObject(objA) || !isObject(objB)) return false
		if (objA === objB || objA.constructor.name != objB.constructor.name) return false
		for (const key in objA) {
			if (isObject(objA[key]) && !isObjectCloned(objA[key], objB[key])) return false
		}
		return true
	}

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
})
