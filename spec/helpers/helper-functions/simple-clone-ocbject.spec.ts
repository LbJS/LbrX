import { simpleCloneObject } from 'lbrx/utils'
import { TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'

describe('Helper Function - simpleCloneObject():', () => {

  const createPlainTestSubjectA = () => TestSubjectFactory.createTestSubject_configA_plain()

  it('should clone object.', () => {
    const state = createPlainTestSubjectA()
    const clonedState = simpleCloneObject(createPlainTestSubjectA())
    assertNotNullable(clonedState.innerTestObject?.deepNestedObj?.objectList)
    assertNotNullable(state.innerTestObject?.deepNestedObj?.objectList)
    assertNotNullable(clonedState.innerTestObject.obj)
    assertNotNullable(state.innerTestObject.obj)
    assertNotNullable(clonedState.innerTestObject.deepNestedObj.objectList[0])
    assertNotNullable(state.innerTestObject.deepNestedObj.objectList[0])
    expect(clonedState).toStrictEqual(createPlainTestSubjectA())
    expect(clonedState).not.toBe(state)
    expect(clonedState.innerTestObject).not.toBe(state.innerTestObject)
    expect(clonedState.innerTestObject).not.toBe(state.innerTestObject)
    expect(clonedState.innerTestObject.deepNestedObj).not.toBe(state.innerTestObject.deepNestedObj)
  })

  it("should return null or undefined if the value that's provided is null or undefined.", () => {
    let result = simpleCloneObject(null as unknown as {})
    expect(result).toBeNull()
    result = simpleCloneObject(undefined as unknown as {})
    expect(result).toBeUndefined()
  })

  it('should return string, number, boolean or method if they are provided', () => {
    let result = simpleCloneObject(false as unknown as {})
    expect(result).toBe(false)
    result = simpleCloneObject('' as unknown as {})
    expect(result).toBe('')
    result = simpleCloneObject(0 as unknown as {})
    expect(result).toBe(0)
    const method = () => { }
    result = simpleCloneObject(method as unknown as {})
    expect(result).toBe(method)
  })
})
