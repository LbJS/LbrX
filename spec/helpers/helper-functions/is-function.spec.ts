import { isFunction } from 'lbrx/utils'
import moment from 'moment'
import { TestSubjectFactory } from '__test__/factories'

describe(`Helper Function - isFunction():`, () => {

  it(`should return true for function.`, () => {
    expect(isFunction(() => { })).toBeTruthy()
  })

  it(`should return false for plain object.`, () => {
    expect(isFunction({})).toBeFalsy()
  })

  it(`should return false for class.`, () => {
    expect(isFunction(TestSubjectFactory.createTestSubject_initial())).toBeFalsy()
  })

  it(`should return false for moment.`, () => {
    expect(isFunction(moment())).toBeFalsy()
  })
})
