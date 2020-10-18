import { isClass } from 'lbrx/utils'
import moment from 'moment'
import { ClassTestSubject } from '__test__/test-subjects'

describe(`Helper Function - isClass():`, () => {

  it(`should return true for constructable object.`, () => {
    expect(isClass(new ClassTestSubject())).toBeTruthy()
  })

  it(`should return true for date object.`, () => {
    expect(isClass(new Date())).toBeTruthy()
  })

  it(`should return true for moment.`, () => {
    expect(isClass(moment())).toBeTruthy()
  })

  it(`should return false for plain object.`, () => {
    expect(isClass({})).toBeFalsy()
  })

  it(`should return false for null.`, () => {
    expect(isClass(null as unknown as {})).toBeFalsy()
  })

  it(`should return false for undefined.`, () => {
    expect(isClass(undefined as unknown as {})).toBeFalsy()
  })

  it(`should return false for boolean.`, () => {
    expect(isClass(true as unknown as {})).toBeFalsy()
  })

  it(`should return false for Symbol.`, () => {
    expect(isClass(Symbol() as unknown as {})).toBeFalsy()
  })
})
