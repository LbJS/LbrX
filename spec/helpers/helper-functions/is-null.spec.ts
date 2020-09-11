import { isNull } from 'lbrx/utils'

describe('Helper Function - isNull():', () => {

  it('should return true for null.', () => {
    expect(isNull(null)).toBeTruthy()
  })

  it('should return false for undefined', () => {
    expect(isNull(undefined)).toBeFalsy()
  })

  it('should return false for false', () => {
    expect(isNull(false)).toBeFalsy()
  })

  it('should return false for 0', () => {
    expect(isNull(0)).toBeFalsy()
  })

  it('should return false for empty string', () => {
    expect(isNull('')).toBeFalsy()
  })

  it('should return false for undefined variable.', () => {
    // tslint:disable-next-line: prefer-const
    let empty: undefined
    expect(isNull(empty)).toBeFalsy()
  })
})
