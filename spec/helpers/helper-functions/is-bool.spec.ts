import { isBool } from 'lbrx/utils'

describe(`Helper Function - isBool():`, () => {

  it(`should return true for true.`, () => {
    expect(isBool(true)).toBeTruthy()
  })

  it(`should return true for false.`, () => {
    expect(isBool(false)).toBeTruthy()
  })

  it(`should return false for undefined.`, () => {
    expect(isBool(undefined)).toBeFalsy()
  })

  it(`should return false for null.`, () => {
    expect(isBool(null)).toBeFalsy()
  })

  it(`should return false for 0.`, () => {
    expect(isBool(0)).toBeFalsy()
  })

  it(`should return false for empty string.`, () => {
    expect(isBool(``)).toBeFalsy()
  })
})
