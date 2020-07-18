import { isArray } from 'lbrx/helpers'

describe('Helper Function - isArray():', () => {

  it('should return true for array.', () => {
    expect(isArray([])).toBeTruthy()
  })

  it('should return false for object.', () => {
    expect(isArray({})).toBeFalsy()
  })
})
