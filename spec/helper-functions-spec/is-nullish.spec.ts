import { isNullish } from 'lbrx/helpers'

describe('Helper Function - isNullish():', () => {

	it('should return true for null.', () => {
		expect(isNullish(null)).toBeTruthy()
	})

	it('should return true for undefined.', () => {
		expect(isNullish(undefined)).toBeTruthy()
	})

	it('should return false for 0.', () => {
		expect(isNullish(0)).toBeFalsy()
	})

	it('should return false for empty string.', () => {
		expect(isNullish('')).toBeFalsy()
	})
})
