import { isClass } from 'lbrx/helpers'
import { Person } from 'test-subjects'

describe('Helper Function - isClass():', () => {

  it('should return true for constructable object.', () => {
    expect(isClass(new Person({}))).toBeTruthy()
  })

  it('should return false for plain object.', () => {
    expect(isClass({})).toBeFalsy()
  })

  it('should return false for null.', () => {
    expect(isClass(null as unknown as {})).toBeFalsy()
  })

  it('should return false for undefined.', () => {
    expect(isClass(undefined as unknown as {})).toBeFalsy()
  })
})
