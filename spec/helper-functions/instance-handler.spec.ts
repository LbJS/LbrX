import { TestSubjectFactory } from 'helpers/factories'
import { assertNotNullable, toPlainObject } from 'helpers/functions'
import { DeepNestedTestSubject, InnerTestSubject, TestSubject } from 'helpers/test-subjects'
import { instanceHandler } from 'lbrx/helpers'
import moment, { Moment } from 'moment'

describe('Helper Function - instanceHandler():', () => {

  const createInstancedObjA = () => TestSubjectFactory.createTestSubject_configA()
  const createPlainObjA = () => TestSubjectFactory.createTestSubject_configA_plain()

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

  it('should create a moment object if it is moment', () => {
    const objWithMoment = { a: moment() }
    const plainObj = toPlainObject(objWithMoment)
    const resultObj: { a: Moment } = instanceHandler(objWithMoment, plainObj) as { a: Moment }
    expect(moment.isMoment(resultObj.a)).toBeTruthy()
    expect(resultObj).toStrictEqual(objWithMoment)
  })
})
