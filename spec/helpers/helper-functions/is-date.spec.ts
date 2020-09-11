import { isDate } from 'lbrx/utils'

describe('Helper Function - isDate():', () => {

  it('should return true for Date object.', () => {
    expect(isDate(new Date())).toBeTruthy()
  })

  it('should return false for undefined.', () => {
    expect(isDate(undefined)).toBeFalsy()
  })

  it('should return false for null.', () => {
    expect(isDate(null)).toBeFalsy()
  })
})
