import { isObject } from 'lbrx/helpers'
import { Person } from 'test-subjects'

describe('Helper Function - isObject():', () => {

	it('should return true for plain object.', () => {
		expect(isObject({})).toBeTruthy()
	})

	it('should return true for constructable object.', () => {
		expect(isObject(new Person({}))).toBeTruthy()
	})

	it('should return false for null.', () => {
		expect(isObject(null)).toBeFalsy()
	})

	it('should return false for undefined.', () => {
		expect(isObject(undefined)).toBeFalsy()
	})

	it('should return false for string.', () => {
		expect(isObject('test string')).toBeFalsy()
	})

	it('should return false for number.', () => {
		expect(isObject(-1986)).toBeFalsy()
	})
})
