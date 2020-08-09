import { TestSubjectFactory } from 'helpers/factories'
import { assertNotNullable } from 'helpers/functions'
import { cloneObject } from 'lbrx/utils'
import moment from 'moment'

describe('Helper Function - cloneObject():', () => {

  const createTestSubjectA = () => TestSubjectFactory.createTestSubject_configA()
  const createObjWithMoment = () => ({ a: moment(new Date(1900, 1)) })
  const createObjWithSymbol = () => ({ a: Symbol() })

  it('should clone object.', () => {
    const state = createTestSubjectA()
    const clonedState = cloneObject(createTestSubjectA())
    assertNotNullable(clonedState.innerTestObjectGetSet?.deepNestedObj?.objectList)
    assertNotNullable(state.innerTestObjectGetSet?.deepNestedObj?.objectList)
    assertNotNullable(clonedState.innerTestObjectGetSet.obj)
    assertNotNullable(state.innerTestObjectGetSet.obj)
    assertNotNullable(clonedState.innerTestObjectGetSet.deepNestedObj.objectList[0])
    assertNotNullable(state.innerTestObjectGetSet.deepNestedObj.objectList[0])
    expect(clonedState).toStrictEqual(createTestSubjectA())
    expect(clonedState).not.toBe(state)
    expect(clonedState.dateValue).not.toBe(state.dateValue)
    expect(clonedState.innerTestObject).not.toBe(state.innerTestObject)
    expect(clonedState.innerTestObjectGetSet).not.toBe(state.innerTestObjectGetSet)
    expect(clonedState.innerTestObjectGetSet.getterSetterDate).not.toBe(state.innerTestObjectGetSet.getterSetterDate)
    expect(clonedState.innerTestObjectGetSet.deepNestedObj).not.toBe(state.innerTestObjectGetSet.deepNestedObj)
    expect(clonedState.innerTestObjectGetSet.obj.date).not.toBe(state.innerTestObjectGetSet.obj.date)
    expect(clonedState.innerTestObjectGetSet.deepNestedObj.objectList[0].date).not
      .toBe(state.innerTestObjectGetSet.deepNestedObj.objectList[0].date)
  })

  it('should clone moment object.', () => {
    const objWithMoment = createObjWithMoment()
    const clonedObjWithMoment = cloneObject(objWithMoment)
    expect(moment.isMoment(clonedObjWithMoment.a)).toBeTruthy()
    expect(clonedObjWithMoment).toStrictEqual(createObjWithMoment())
    expect(clonedObjWithMoment.a).not.toBe(objWithMoment.a)
  })

  it('should copy symbols reference.', () => {
    const objWithSymbol = createObjWithSymbol()
    const clonedObjWithSymbol = cloneObject(objWithSymbol)
    expect(typeof clonedObjWithSymbol.a).toBe('symbol')
    expect(clonedObjWithSymbol).toStrictEqual(objWithSymbol)
    expect(clonedObjWithSymbol.a).toBe(clonedObjWithSymbol.a)
  })

  it("should return null or undefined if the value that's provided is null or undefined.", () => {
    let result = cloneObject(null as unknown as {})
    expect(result).toBeNull()
    result = cloneObject(undefined as unknown as {})
    expect(result).toBeUndefined()
  })

  it('should return string, number, boolean or method if they are provided', () => {
    let result = cloneObject(false as unknown as {})
    expect(result).toBe(false)
    result = cloneObject('' as unknown as {})
    expect(result).toBe('')
    result = cloneObject(0 as unknown as {})
    expect(result).toBe(0)
    const method = () => { }
    result = cloneObject(method as unknown as {})
    expect(result).toBe(method)
  })
})
