import { isString } from 'lbrx/utils'

describe(`Helper Function - isString():`, () => {

  it(`should return true for string.`, () => {
    expect(isString(``)).toBeTruthy()
  })

  it(`should return false boolean.`, () => {
    expect(isString(true)).toBeFalsy()
  })

  it(`should return false number.`, () => {
    expect(isString(1)).toBeFalsy()
  })

  it(`should return false for null.`, () => {
    expect(isString(null)).toBeFalsy()
  })

  it(`should return false for undefined.`, () => {
    expect(isString(undefined)).toBeFalsy()
  })
})
