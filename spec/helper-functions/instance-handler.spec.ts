import { TestSubjectFactory } from 'helpers/factories'
import { toPlainObject } from 'helpers/functions'
import { DeepNestedTestSubject, InnerTestSubject, TestSubject } from 'helpers/test-subjects'
import { instanceHandler } from 'lbrx/helpers'
import moment, { Moment } from 'moment'

describe('Helper Function - instanceHandler():', () => {

  const createInstancedObjA = () => TestSubjectFactory.createTestSubject_configA()
  const createPlainObjA = () => TestSubjectFactory.createTestSubject_configA_plain()
  const instancedResultA: TestSubject = instanceHandler(createInstancedObjA(), createPlainObjA())

  it.each`
    testId | valueName                                                 | value                                                     | expectedInstance
    ${1}   | ${'instancedResultA'}                                     | ${instancedResultA}                                       | ${TestSubject}
    ${2}   | ${'instancedResultA.dateValue'}                           | ${instancedResultA.dateValue}                             | ${Date}
    ${3}   | ${'instancedResultA.innerTestObject'}                     | ${instancedResultA.innerTestObject}                       | ${InnerTestSubject}
    ${4}   | ${'instancedResultA.innerTestObject.dateValue'}           | ${instancedResultA.innerTestObject!.dateValue}            | ${Date}
    ${5}   | ${'instancedResultA.innerTestObjectGetSet'}               | ${instancedResultA.innerTestObjectGetSet}                 | ${InnerTestSubject}
    ${6}   | ${'instancedResultA.innerTestObjectGetSet.dateValue'}     | ${instancedResultA.innerTestObjectGetSet!.dateValue}      | ${Date}
    ${7}   | ${'instancedResultA.innerTestObjectGetSet.deepNestedObj'} | ${instancedResultA.innerTestObjectGetSet!.deepNestedObj}  | ${DeepNestedTestSubject}
    ${8}   | ${'" .objectList[0]?.date'}         | ${instancedResultA.innerTestObjectGetSet!.deepNestedObj!.objectList![0]!.date}  | ${Date}
  `('should create an instance of $expectedInstance for $valueName. (testId: $testId)', ({ value, expectedInstance }) => {
    expect(value).toBeInstanceOf(expectedInstance)
  })

  it('should create a moment object if it is moment', () => {
    const objWithMoment = { a: moment() }
    const plainObj = toPlainObject(objWithMoment)
    const resultObj: { a: Moment } = instanceHandler(objWithMoment, plainObj) as { a: Moment }
    expect(moment.isMoment(resultObj.a)).toBeTruthy()
    expect(resultObj).toStrictEqual(objWithMoment)
  })
})
