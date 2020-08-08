import { TestSubjectFactory } from 'helpers/factories'
import { assertNotNullable, objectAssign, toPlainObject } from 'helpers/functions'
import { DeepNestedTestSubject, InnerTestSubject, TestSubject } from 'helpers/test-subjects'
import { instanceHandler } from 'lbrx/helpers'
import moment from 'moment'

describe('Helper Function - instanceHandler():', () => {

  const createInstancedObjA = () => TestSubjectFactory.createTestSubject_configA()
  const createPlainObjA = () => TestSubjectFactory.createTestSubject_configA_plain()
  const createObjWithMomentA = () => ({ a: moment() })
  const createObjWithMomentB = () => ({ a: moment(new Date(1900, 1)) })
  const createObjWithSymbol = () => ({ a: Symbol() })

  it('should create an instance for the root object and all nested objects.', () => {
    const result: TestSubject = instanceHandler(createInstancedObjA(), createPlainObjA())
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

  it('should create a moment object if it is moment.', () => {
    let objWithMoment = createObjWithMomentA()
    let plainObj = toPlainObject(objWithMoment)
    let resultObj = instanceHandler(objWithMoment, plainObj)
    expect(moment.isMoment(resultObj.a)).toBeTruthy()
    expect(resultObj).toStrictEqual(objWithMoment)
    objWithMoment = createObjWithMomentB()
    plainObj = toPlainObject(objWithMoment)
    resultObj = instanceHandler(objWithMoment, plainObj)
    expect(moment.isMoment(resultObj.a)).toBeTruthy()
    expect(resultObj).toStrictEqual(objWithMoment)
  })

  it('should ignore symbol on instanced obj.', () => {
    const objWithSymbol = createObjWithSymbol()
    const plainObjWithSymbol = toPlainObject(createObjWithSymbol())
    const result = instanceHandler(objWithSymbol, plainObjWithSymbol)
    expect(result.a).toBeUndefined()
  })

  it('should return plain object if the instanced object is null or undefined.', () => {
    let plainObjA = instanceHandler(null as unknown as {}, createPlainObjA())
    expect(plainObjA).toStrictEqual(createPlainObjA())
    plainObjA = instanceHandler(undefined as unknown as {}, createPlainObjA())
    expect(plainObjA).toStrictEqual(createPlainObjA())
  })

  it('should return null or undefined if the plain object is null or undefined.', () => {
    let result = instanceHandler(createInstancedObjA(), null as unknown as {})
    expect(result).toBeNull()
    result = instanceHandler(createInstancedObjA(), undefined as unknown as {})
    expect(result).toBeUndefined()
  })

  it('should return the plain object if the instanced object is not applicable.', () => {
    let instancedObj = { a: new TestSubject({}) }
    let plainObj: { a: string | number } = { a: 'test' }
    let result = instanceHandler(instancedObj, objectAssign({}, plainObj))
    expect(result).toStrictEqual(plainObj)
    instancedObj = { a: new TestSubject({}) }
    plainObj = { a: 10 }
    result = instanceHandler(instancedObj, objectAssign({}, plainObj))
    expect(result).toStrictEqual(plainObj)
  })
})
