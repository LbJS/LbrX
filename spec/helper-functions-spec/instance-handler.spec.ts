import { assertNotNullable } from 'helpers'
import { instanceHandler } from 'lbrx/helpers'
import { DeepNestedTestSubjectA, InnerTestSubjectA, TestSubjectA, TestSubjectsFactory } from 'test-subjects'

describe('Helper Function - instanceHandler():', () => {

  let instancedTestSubject: TestSubjectA
  let plainTestSubject: TestSubjectA

  beforeEach(() => {
    instancedTestSubject = TestSubjectsFactory.createTestSubjectA_configA()
    plainTestSubject = TestSubjectsFactory.createTestSubjectA_configA_plain()
  })

  it('should create an instance for object and all nested objects based on an instanced object.', () => {
    const result = instanceHandler(instancedTestSubject, plainTestSubject)
    assertNotNullable(result.innerTestObject)
    assertNotNullable(result.innerTestObjectGetSet?.deepNestedObj?.objectList)
    expect(result).toBeInstanceOf(TestSubjectA)
    expect(result.dateValue).toBeInstanceOf(Date)
    expect(result.innerTestObject).toBeInstanceOf(InnerTestSubjectA)
    expect(result.innerTestObject.dateValue).toBeInstanceOf(Date)
    expect(result.innerTestObjectGetSet).toBeInstanceOf(InnerTestSubjectA)
    expect(result.innerTestObjectGetSet.dateValue).toBeInstanceOf(Date)
    expect(result.innerTestObjectGetSet.deepNestedObj).toBeInstanceOf(DeepNestedTestSubjectA)
    expect(result.innerTestObjectGetSet.deepNestedObj.objectList[0]?.date).toBeInstanceOf(Date)
  })
})
