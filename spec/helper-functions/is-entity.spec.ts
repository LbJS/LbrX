import { ErrorFactory, TestSubjectFactory } from 'helpers/factories'
import { isEntity } from 'lbrx/helpers'

describe('Helper Function - isEntity():', () => {

  it('should return true for plain object', () => {
    const testSubject = TestSubjectFactory.createTestSubjectWithMethods_configA_plain()
    expect(isEntity(testSubject)).toBeTruthy()
  })

  it('should return true for instanced object', () => {
    const testSubject = TestSubjectFactory.createTestSubjectWithMethods_configA()
    expect(isEntity(testSubject)).toBeTruthy()
  })

  it('should return false for Array.', () => {
    expect(isEntity([])).toBeFalsy()
  })

  it('should return false for Date.', () => {
    expect(isEntity(new Date())).toBeFalsy()
  })

  it('should return false for Error.', () => {
    const error = ErrorFactory.createError()
    expect(isEntity(error)).toBeFalsy()
  })

  it('should return false for Custom Error.', () => {
    const customError = ErrorFactory.createErrorTestSubject()
    expect(isEntity(customError)).toBeFalsy()
  })
})
