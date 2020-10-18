import { isUndefined } from 'lbrx/utils'

describe(`Helper Function - isUndefined():`, () => {

  it(`should return true for undefined.`, () => {
    expect(isUndefined(undefined)).toBeTruthy()
  })

  it(`should return false for null`, () => {
    expect(isUndefined(null)).toBeFalsy()
  })

  it(`should return false for false`, () => {
    expect(isUndefined(false)).toBeFalsy()
  })

  it(`should return false for 0`, () => {
    expect(isUndefined(0)).toBeFalsy()
  })

  it(`should return false for empty string`, () => {
    expect(isUndefined(``)).toBeFalsy()
  })

  it(`should return true for undefined variable.`, () => {
    // tslint:disable-next-line: prefer-const
    let empty: undefined
    expect(isUndefined(empty)).toBeTruthy()
  })
})
