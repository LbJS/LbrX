import { assertNotNullable } from 'helpers'
import { instanceHandler } from 'lbrx/helpers'
import { DeepNestedTestSubject, InnerTestSubject, TestSubject, TestSubjectsFactory } from 'test-subjects'

describe('Helper Function - instanceHandler():', () => {

  let instancedTestSubject: TestSubject
  let plainTestSubject: TestSubject

  beforeEach(() => {
    instancedTestSubject = TestSubjectsFactory.createTestSubject_configA()
    plainTestSubject = TestSubjectsFactory.createTestSubject_configA_plain()
  })

  it('should create an instance for object and all nested objects based on an instanced object.', () => {
    const result = instanceHandler(instancedTestSubject, plainTestSubject)
    assertNotNullable(result.innerTestObject)
    assertNotNullable(result.innerTestObjectGetSet?.deepNestedObj?.objectList)
    expect(result).toBeInstanceOf(TestSubject)
    expect(result.dateValue).toBeInstanceOf(Date)
    expect(result.innerTestObject).toBeInstanceOf(InnerTestSubject)
    expect(result.innerTestObject.dateValue).toBeInstanceOf(Date)
    expect(result.innerTestObjectGetSet).toBeInstanceOf(InnerTestSubject)
    expect(result.innerTestObjectGetSet.dateValue).toBeInstanceOf(Date)
    expect(result.innerTestObjectGetSet.deepNestedObj).toBeInstanceOf(DeepNestedTestSubject)
    expect(result.innerTestObjectGetSet.deepNestedObj.objectList[0]?.date).toBeInstanceOf(Date)
  })
})
