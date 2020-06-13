import { TestSubjectFactory } from 'helpers/factories'
import { assertNotNullable } from 'helpers/functions'
import { cloneObject } from 'lbrx/helpers'

describe('Helper Function - cloneObject():', () => {

  const stateA = TestSubjectFactory.createTestSubject_configA()
  const pureStateA = TestSubjectFactory.createTestSubject_configA()

  it('should copy all properties', () => {
    const clonedStateA = cloneObject(stateA)
    expect(clonedStateA).toStrictEqual(pureStateA)
  })

  it('should set different references.', () => {
    const clonedStateA = cloneObject(stateA)
    assertNotNullable(clonedStateA.innerTestObjectGetSet?.deepNestedObj?.objectList)
    assertNotNullable(stateA.innerTestObjectGetSet?.deepNestedObj?.objectList)
    assertNotNullable(clonedStateA.innerTestObjectGetSet.obj)
    assertNotNullable(stateA.innerTestObjectGetSet.obj)
    assertNotNullable(clonedStateA.innerTestObjectGetSet.deepNestedObj.objectList[0])
    assertNotNullable(stateA.innerTestObjectGetSet.deepNestedObj.objectList[0])
    expect(clonedStateA).not.toBe(stateA)
    expect(clonedStateA.dateValue).not.toBe(stateA.dateValue)
    expect(clonedStateA.innerTestObject).not.toBe(stateA.innerTestObject)
    expect(clonedStateA.innerTestObjectGetSet).not.toBe(stateA.innerTestObjectGetSet)
    expect(clonedStateA.innerTestObjectGetSet.getterSetterDate).not.toBe(stateA.innerTestObjectGetSet.getterSetterDate)
    expect(clonedStateA.innerTestObjectGetSet.deepNestedObj).not.toBe(stateA.innerTestObjectGetSet.deepNestedObj)
    expect(clonedStateA.innerTestObjectGetSet.obj.date).not.toBe(stateA.innerTestObjectGetSet.obj.date)
    expect(clonedStateA.innerTestObjectGetSet.deepNestedObj.objectList[0].date).not
      .toBe(stateA.innerTestObjectGetSet.deepNestedObj.objectList[0].date)
  })
})
