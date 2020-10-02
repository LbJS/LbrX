import { isNumber } from 'lbrx/utils'

describe('Helper Function - isNumber():', () => {

  it('should return true.', () => {
    expect(isNumber(0)).toBeTruthy()
    expect(isNumber(10)).toBeTruthy()
    expect(isNumber(-10)).toBeTruthy()
  })

  it('should return false.', () => {
    expect(isNumber(false)).toBeFalsy()
    expect(isNumber('')).toBeFalsy()
    expect(isNumber(null)).toBeFalsy()
    expect(isNumber(new Date())).toBeFalsy()
  })
})
