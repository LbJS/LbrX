import { shallowCompareObjects } from 'lbrx/utils'
import moment from 'moment'
import { TestSubjectFactory } from '__test__/factories'
import { toPlainObject } from '__test__/functions'
import { InnerTestSubject, TestSubject } from '__test__/test-subjects'

// tslint:disable: variable-name

describe(`Helper Function - shallowCompareObjects():`, () => {

  const createStateConfigA = () => TestSubjectFactory.createTestSubject_configA()
  const createStateConfigB = () => TestSubjectFactory.createTestSubject_configB()
  const createStateConfigA_plain = () => TestSubjectFactory.createTestSubject_configA_plain()

  it(`should return that the given objects are equal.`, () => {
    expect(shallowCompareObjects(createStateConfigA(), createStateConfigA())).toBeTruthy()
    expect(shallowCompareObjects(createStateConfigA(), createStateConfigA_plain())).toBeTruthy()
  })

  it(`should return that the given objects are not equal.`, () => {
    expect(shallowCompareObjects(createStateConfigA(), createStateConfigB())).toBeFalsy()
  })

  it.each`
    testId  | objA                                                      | objB                                                      | isEqual
    ${1.01} | ${{ a: `a`, b: `b` }}                                     | ${{ a: `a`, b: `c` }}                                     | ${false}
    ${1.02} | ${{ a: () => { }, b: null }}                              | ${{ a: false, b: () => { } }}                             | ${false}
    ${1.03} | ${{ a: () => { } }}                                       | ${{ a: () => { } }}                                       | ${true}
    ${1.04} | ${{ a: `a`, b: `b`, c: `3` }}                             | ${{ a: null, b: undefined, c: 3 }}                        | ${false}
    ${1.05} | ${{ a: 0, b: 0, c: 0 }}                                   | ${{ a: null, b: undefined, c: `` }}                       | ${false}
    ${1.06} | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 1) }}   | ${{ a: new Date(2000, 0, 1), b: null }}                   | ${false}
    ${1.07} | ${{ a: null, b: new Date(2000, 0, 1) }}                   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 2) }}   | ${false}
    ${1.08} | ${{ a: undefined, b: new Date(2000, 0, 1) }}              | ${{ a: new Date(2000, 0, 1), b: undefined }}              | ${false}
    ${1.09} | ${{ a: null, b: undefined }}                              | ${{ a: undefined, b: null }}                              | ${false}
    ${1.10} | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}                                       | ${true}
    ${1.11} | ${{ a: [], b: {} }}                                       | ${{ a: {}, b: [] }}                                       | ${false}
    ${1.12} | ${{ a: {}, b: {} }}                                       | ${{ a: new Date(2000, 0, 1), b: () => { } }}              | ${false}
    ${1.13} | ${{ a: null, b: undefined }}                              | ${{ a: null, b: undefined }}                              | ${true}
  `(`should return $isEqual. (testId: $testId)`, ({ objA, objB, isEqual }) => {
    expect(shallowCompareObjects(objA, objB)).toBe(isEqual)
    expect(shallowCompareObjects(objB, objA)).toBe(isEqual)
  })

  it.each`
    testId  | arrA                                                      | arrB                                                      | isEqual
    ${2.01} | ${[false]}                                                | ${[]}                                                     | ${false}
    ${2.02} | ${[undefined]}                                            | ${[]}                                                     | ${false}
    ${2.03} | ${[null]}                                                 | ${[]}                                                     | ${false}
    ${2.04} | ${[null]}                                                 | ${[undefined]}                                            | ${true}
    ${2.05} | ${[]}                                                     | ${[]}                                                     | ${true}
    ${2.06} | ${[null, undefined, 0, ``, false]}                        | ${[]}                                                     | ${false}
    ${2.07} | ${[{ a: [] }, { a: [1] }]}                                | ${[{ a: [1] }, { a: [1] }]}                               | ${false}
    ${2.08} | ${[{ a: [true] }, { a: [1] }]}                            | ${[{ a: [true] }, { a: [1] }]}                            | ${true}
    ${2.09} | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${true}
    ${2.10} | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 1)]] }]}                     | ${false}
    ${2.11} | ${[() => { }]}                                            | ${[]}                                                     | ${false}
    ${2.12} | ${[() => { }]}                                            | ${[() => { }]}                                            | ${true}
    ${2.13} | ${[[[0]]]}                                                | ${[[[false]]]}                                            | ${false}
  `(`should return $isEqual. (testId: $testId)`, ({ arrA, arrB, isEqual }) => {
    expect(shallowCompareObjects(arrA, arrB)).toBe(isEqual)
    expect(shallowCompareObjects(arrB, arrA)).toBe(isEqual)
  })

  it.each`
    testId  | objA                                                      | objB                                                      | isEqual
    ${3.01} | ${{ a: { a: false } }}                                    | ${{ a: { a: false } }}                                    | ${true}
    ${3.02} | ${{ a: { a: false } }}                                    | ${{ a: { a: true } }}                                     | ${false}
    ${3.03} | ${{ a: { a: null } }}                                     | ${{ a: { a: undefined } }}                                | ${false}
    ${3.04} | ${{ a: { a: null } }}                                     | ${{ a: { b: undefined } }}                                | ${false}
    ${3.05} | ${{ a: { a: [null] } }}                                   | ${{ a: { a: [undefined] } }}                              | ${true}
    ${3.06} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 0) } }}                        | ${true}
    ${3.07} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 1) } }}                        | ${false}
    ${3.08} | ${{ a: { b: () => { } } }}                                | ${{ a: { b: () => { } } }}                                | ${true}
    ${3.09} | ${{ a: { b: () => { } } }}                                | ${{ a: { b: [] } }}                                       | ${false}
    ${3.10} | ${{ a: { b: Symbol() } }}                                 | ${{ a: { b: Symbol() } }}                                 | ${true}
    ${3.11} | ${{ a: { b: () => { } } }}                                | ${{ a: { b: Symbol() } }}                                 | ${true}
    ${3.12} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: {} } }}                                       | ${false}
    ${3.13} | ${{ a: { b: { c: { a: [] } } } }}                         | ${{ a: { b: { c: { a: [] } } } }}                         | ${true}
  `(`should return $isEqual. (testId: $testId)`, ({ objA, objB, isEqual }) => {
    expect(shallowCompareObjects(objA, objB)).toBe(isEqual)
    expect(shallowCompareObjects(objB, objA)).toBe(isEqual)
  })

  const instancedTestSubject = new TestSubject({ innerTestObject: new InnerTestSubject({ booleanValue: true }) })
  const plainTestSubject = toPlainObject(instancedTestSubject)

  it.each`
    testId  | objA                                                        | objB                                                            | isEqual
    ${4.01} | ${new TestSubject({})}                                      | ${new TestSubject({})}                                          | ${true}
    ${4.02} | ${new TestSubject({ getterSetterDate: new Date(1900, 0) })} | ${new TestSubject({ getterSetterDate: new Date(1900, 1) })}     | ${false}
    ${4.03} | ${instancedTestSubject}                                     | ${plainTestSubject}                                             | ${true}
  `(`should return $isEqual. (testId: $testId)`, ({ objA, objB, isEqual }) => {
    expect(shallowCompareObjects(objA, objB)).toBe(isEqual)
    expect(shallowCompareObjects(objB, objA)).toBe(isEqual)
  })

  it.each`
    testId  | objA                                                        | objB                                                            | isEqual
    ${5.01} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: moment(new Date(1900, 0)) }}                             | ${true}
    ${5.02} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: moment(new Date(1900, 1)) }}                             | ${false}
    ${5.03} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: new Date(1900, 0) }}                                     | ${true}
  `(`should return $isEqual. (testId: $testId)`, ({ objA, objB, isEqual }) => {
    expect(shallowCompareObjects(objA, objB)).toBe(isEqual)
    expect(shallowCompareObjects(objB, objA)).toBe(isEqual)
  })
})
