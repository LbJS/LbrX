import { cloneError } from 'lbrx/utils'
import { ErrorTestSubject } from 'provider'
import { assertNotNullable } from '__test__/functions'

describe('Helper Function - cloneError():', () => {

  it('should clone Error object.', () => {
    const error = new Error('Some error text')
    const copy = cloneError(error)
    expect(copy).toStrictEqual(error)
    expect(copy.message).toBe(error.message)
    expect(copy).toBeInstanceOf(Error)
    expect(copy).not.toBe(error)
  })

  it('should clone custom Error object.', () => {
    const error = new ErrorTestSubject('Some error text')
    const copy = cloneError(error)
    expect(copy).toStrictEqual(error)
    expect(copy.message).toBe(error.message)
    expect(copy).toBeInstanceOf(Error)
    expect(copy).toBeInstanceOf(ErrorTestSubject)
    expect(copy).not.toBe(error)
  })

  it('should clone custom Error object and inner custom errors.', () => {
    let error = new ErrorTestSubject('Some error text1')
    error = new ErrorTestSubject(error, 'Some error text2')
    error = new ErrorTestSubject(error, 'Some error text3')
    const copy = cloneError(error)
    expect(copy).toStrictEqual(error)
    expect(copy.message).toBe(error.message)
    assertNotNullable(copy.innerError)
    assertNotNullable(error.innerError)
    expect(copy.innerError.message).toBe(error.innerError.message)
    assertNotNullable(copy.innerError.innerError)
    assertNotNullable(error.innerError.innerError)
    expect(copy.innerError.innerError.message).toBe(error.innerError.innerError.message)
    expect(copy).toBeInstanceOf(Error)
    expect(copy).toBeInstanceOf(ErrorTestSubject)
    expect(copy.innerError).toBeInstanceOf(Error)
    expect(copy.innerError).toBeInstanceOf(ErrorTestSubject)
    expect(copy.innerError.innerError).toBeInstanceOf(Error)
    expect(copy.innerError.innerError).toBeInstanceOf(ErrorTestSubject)
    expect(copy).not.toBe(error)
    expect(copy.innerError).not.toBe(error.innerError)
    expect(copy.innerError.innerError).not.toBe(error.innerError.innerError)
  })

  it("should clone object that doesn't inherit from Error.", () => {
    class LocalError {
      constructor(public message: string, public innerError: LocalError | null = null) { }
    }
    let error = new LocalError('Some error text1')
    error = new LocalError('Some error text2', error)
    error = new LocalError('Some error text3', error)
    const copy = cloneError(error)
    expect(copy).toStrictEqual(error)
    expect(copy.message).toBe(error.message)
    assertNotNullable(copy.innerError)
    assertNotNullable(error.innerError)
    expect(copy.innerError.message).toBe(error.innerError.message)
    assertNotNullable(copy.innerError.innerError)
    assertNotNullable(error.innerError.innerError)
    expect(copy.innerError.innerError.message).toBe(error.innerError.innerError.message)
    expect(copy).toBeInstanceOf(LocalError)
    expect(copy.innerError).toBeInstanceOf(LocalError)
    expect(copy.innerError.innerError).toBeInstanceOf(LocalError)
    expect(copy).not.toBe(error)
    expect(copy.innerError).not.toBe(error.innerError)
    expect(copy.innerError.innerError).not.toBe(error.innerError.innerError)
  })
})
