import { getNestedProp } from 'lbrx/utils'
import { TestSubjectFactory } from 'provider'

describe('Helper Function - getNestedProp():', () => {

  it('should get nested property.', () => {
    const testSubject = TestSubjectFactory.createTestSubjectWithMethods_configA()
    expect(getNestedProp(testSubject, 'dateValue')).toBe(testSubject.dateValue)
    expect(getNestedProp(testSubject, 'innerTestObject', 'numberValue')).toBe(testSubject.innerTestObject!.numberValue)
    expect(getNestedProp(testSubject, 'innerTestObject', 'deepNestedObj', 'stringValue'))
      .toBe(testSubject.innerTestObject!.deepNestedObj!.stringValue)
  })

  it('should return null if null is provided.', () => {
    expect(getNestedProp(null, 'someValue')).toBe(null)
  })

  it('should return if the nested object is not assigned', () => {
    const testSubject = TestSubjectFactory.createTestSubjectWithMethods_configB()
    expect(getNestedProp(testSubject, 'innerTestObject', 'deepNestedObj', 'stringValue')).toBe(testSubject.innerTestObject)
  })
})
