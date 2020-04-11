import { assertIsArray, assertNotNullable } from 'helpers'
import { deepFreeze } from 'lbrx/helpers'
import { TestSubject, TestSubjectConfigurations, TestSubjectsFactory } from '../test-subjects'

describe('Helper Function - deepFreeze():', () => {

  let testSubject: TestSubject

  beforeEach(() => {
    testSubject = TestSubjectsFactory.createTestSubject_configA()
    deepFreeze(testSubject)
  })

  it('should cause test subject to throw on string value modification.', () => {
    expect(() => {
      testSubject.stringValue = 'some other string'
    }).toThrow()
  })

  it("should cause test subject to throw on date's modification.", () => {
    assertNotNullable(testSubject.dateValue)
    expect(() => {
      testSubject.dateValue!.setFullYear(1986)
    }).toThrow()
  })

  it("should cause test subject to throw on inner object's date modification.", () => {
    assertNotNullable(testSubject.innerTestObject?.dateValue)
    expect(() => {
      testSubject.innerTestObject!.dateValue!.setFullYear(1986)
    }).toThrow()
  })

  it('should cause test subject to throw on inners object modification.', () => {
    assertNotNullable(testSubject.innerTestObject)
    expect(() => {
      const newInnerTestObject = TestSubjectsFactory.createInnerTestSubject(TestSubjectConfigurations.configurationB)
      testSubject.innerTestObject = newInnerTestObject
    }).toThrow()
  })

  it('should cause test subject to throw on adding a new item to a list.', () => {
    assertIsArray(testSubject.innerTestObjectGetSet?.deepNestedObj?.objectList)
    expect(() => {
      const newObjForList = {
        value: 'string',
        date: new Date()
      }
      testSubject.innerTestObjectGetSet!.deepNestedObj!.objectList!.push(newObjForList)
    }).toThrow()
  })

  it("should cause test subject to throw on modification an item's list.", () => {
    assertIsArray(testSubject.innerTestObjectGetSet?.deepNestedObj?.objectList)
    assertNotNullable(testSubject.innerTestObjectGetSet.deepNestedObj.objectList[0])
    expect(() => {
      const newObjForReplacement = {
        value: 'string',
        date: new Date()
      }
      testSubject.innerTestObjectGetSet!.deepNestedObj!.objectList![0] = newObjForReplacement
    }).toThrow()
  })

  it('should cause test subject to throw on list replacement.', () => {
    assertIsArray(testSubject.innerTestObjectGetSet?.deepNestedObj?.objectList)
    expect(() => {
      testSubject.innerTestObjectGetSet!.deepNestedObj!.objectList = []
    }).toThrow()
  })
})
