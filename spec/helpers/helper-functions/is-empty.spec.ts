import { isEmpty } from 'lbrx/utils'

describe(`Helper Function - isEmpty():`, () => {

  it(`should return true for null.`, () => {
    expect(isEmpty(null)).toBeTruthy()
  })

  it(`should return true for undefined.`, () => {
    expect(isEmpty(undefined)).toBeTruthy()
  })

  it(`should return false for 0.`, () => {
    expect(isEmpty(0)).toBeFalsy()
  })

  it(`should return false for empty string.`, () => {
    expect(isEmpty(``)).toBeFalsy()
  })

  it(`should return false for false boolean.`, () => {
    expect(isEmpty(false)).toBeFalsy()
  })

  it(`should return true for null variable.`, () => {
    const nullValue = null
    expect(isEmpty(nullValue)).toBeTruthy()
  })

  it(`should return true for undefined variable.`, () => {
    // tslint:disable-next-line: prefer-const
    let empty: undefined
    expect(isEmpty(empty)).toBeTruthy()
  })
})
