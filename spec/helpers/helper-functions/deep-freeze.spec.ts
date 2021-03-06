import { deepFreeze } from 'lbrx/utils'
import { TestSubjectFactory } from '__test__/factories'
import { assertIsArray, assertNotNullable } from '__test__/functions'
import { TestSubject, TestSubjectConfigurations } from '__test__/test-subjects'

describe(`Helper Function - deepFreeze():`, () => {

  let testSubject: TestSubject

  beforeEach(() => {
    testSubject = TestSubjectFactory.createTestSubject_configA()
    deepFreeze(testSubject)
  })

  it(`should cause the test subject entity to throw on string's value modification.`, () => {
    expect(() => {
      testSubject.stringValue = `some other string`
    }).toThrow()
  })

  it(`should cause the test subject entity to throw on date's modification.`, () => {
    assertNotNullable(testSubject.dateValue)
    expect(() => {
      testSubject.dateValue!.setFullYear(1986)
    }).toThrow()
  })

  it(`should cause the test subject entity to throw on inner object's date modification.`, () => {
    assertNotNullable(testSubject.innerTestObject?.dateValue)
    expect(() => {
      testSubject.innerTestObject!.dateValue!.setFullYear(1986)
    }).toThrow()
  })

  it(`should cause the test subject entity to throw on inners object modification.`, () => {
    assertNotNullable(testSubject.innerTestObject)
    expect(() => {
      const newInnerTestObject = TestSubjectFactory.createInnerTestSubject(TestSubjectConfigurations.configurationB)
      testSubject.innerTestObject = newInnerTestObject
    }).toThrow()
  })

  it(`should cause the test subject entity to throw on adding a new item to a inner object's list.`, () => {
    assertIsArray(testSubject.innerTestObjectGetSet?.deepNestedObj?.objectList)
    expect(() => {
      const newObjForList = {
        value: `string`,
        date: new Date()
      }
      testSubject.innerTestObjectGetSet!.deepNestedObj!.objectList!.push(newObjForList)
    }).toThrow()
  })

  it(`should cause the test subject entity to throw on inner object's list item modification.`, () => {
    assertIsArray(testSubject.innerTestObjectGetSet?.deepNestedObj?.objectList)
    assertNotNullable(testSubject.innerTestObjectGetSet.deepNestedObj.objectList[0])
    expect(() => {
      const newObjForReplacement = {
        value: `string`,
        date: new Date()
      }
      testSubject.innerTestObjectGetSet!.deepNestedObj!.objectList![0] = newObjForReplacement
    }).toThrow()
  })

  it(`should cause the test subject entity to throw on inner object's list replacement.`, () => {
    assertIsArray(testSubject.innerTestObjectGetSet?.deepNestedObj?.objectList)
    expect(() => {
      testSubject.innerTestObjectGetSet!.deepNestedObj!.objectList = []
    }).toThrow()
  })
})
