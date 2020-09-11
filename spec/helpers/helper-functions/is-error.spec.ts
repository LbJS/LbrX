import { isError } from 'lbrx/utils'
import { ErrorTestSubject } from 'provider'

describe('Helper Function - isError():', () => {

  it('should return true for array.', () => {
    expect(isError(new Error())).toBeTruthy()
  })

  it('should return true for custom error.', () => {
    expect(isError(new ErrorTestSubject())).toBeTruthy()
  })

  it('should return false for plain object.', () => {
    expect(isError({})).toBeFalsy()
  })
})
