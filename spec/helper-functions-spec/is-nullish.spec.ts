import { isNullable } from 'lbrx/helpers'

describe('Helper Function - isNullish():', () => {

	it('should return true for null.', () => {
		expect(isNullable(null)).toBeTruthy()
	})

	it('should return true for undefined.', () => {
		expect(isNullable(undefined)).toBeTruthy()
	})

	it('should return false for 0.', () => {
		expect(isNullable(0)).toBeFalsy()
	})

	it('should return false for empty string.', () => {
		expect(isNullable('')).toBeFalsy()
	})
})
