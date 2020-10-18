import { isPromise } from 'lbrx/utils'

describe(`Helper Function - isPromise():`, () => {

  it(`should return true for Promise instance.`, () => {
    expect(isPromise(new Promise(() => { }))).toBeTruthy()
  })

  it(`should return true for fulfilled Promise.`, () => {
    expect(isPromise(Promise.resolve())).toBeTruthy()
  })

  it(`should return true for rejected Promise.`, () => {
    expect(isPromise(Promise.reject().catch(() => { }))).toBeTruthy()
  })

  it(`should return false for Promise type.`, () => {
    expect(isPromise(Promise)).toBeFalsy()
  })

  it(`should return false for plain object.`, () => {
    expect(isPromise({})).toBeFalsy()
  })

  it(`should return false for null.`, () => {
    expect(isPromise(null)).toBeFalsy()
  })

  it(`should return false for undefined.`, () => {
    expect(isPromise(undefined)).toBeFalsy()
  })
})
