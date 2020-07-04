import { TestSubjectFactory } from 'helpers/factories'
import { toPlainObject } from 'helpers/functions'
import { InnerTestSubject, TestSubject } from 'helpers/test-subjects'
import { compareObjects } from 'lbrx/helpers'
import moment from 'moment'

// tslint:disable: variable-name

describe('Helper Function - compareObjects():', () => {

  const createStateConfigA = () => TestSubjectFactory.createTestSubject_configA()
  const createStateConfigA_copy = () => TestSubjectFactory.createTestSubject_configA()
  const createStateConfigA_plain = () => TestSubjectFactory.createTestSubject_configA_plain()
  const createStateConfigB = () => TestSubjectFactory.createTestSubject_configB()
  const createStateConfigB_copy = () => TestSubjectFactory.createTestSubject_configB()
  const createStateWithMethodsConfigA = () => TestSubjectFactory.createTestSubjectWithMethods_configA()
  const createStateWithMethodsConfigA_copy = () => TestSubjectFactory.createTestSubjectWithMethods_configA()
  const createStateWithMethodsConfigA_plain = () => TestSubjectFactory.createTestSubjectWithMethods_configA_plain()
  const createStateWithMethodsConfigB = () => TestSubjectFactory.createTestSubjectWithMethods_configB()
  const createStateWithMethodsConfigB_copy = () => TestSubjectFactory.createTestSubjectWithMethods_configB()

  it('should return that the given objects are equal.', () => {
    expect(compareObjects(createStateConfigA(), createStateConfigA_copy())).toBeTruthy()
    expect(compareObjects(createStateConfigB(), createStateConfigB_copy())).toBeTruthy()
    expect(compareObjects(createStateWithMethodsConfigA(), createStateWithMethodsConfigA_copy())).toBeTruthy()
    expect(compareObjects(createStateWithMethodsConfigB(), createStateWithMethodsConfigB_copy())).toBeTruthy()
  })

  it('should return that the given objects are not equal.', () => {
    expect(compareObjects(createStateConfigA(), createStateConfigA_plain())).toBeFalsy()
    expect(compareObjects(createStateConfigA(), createStateConfigB())).toBeFalsy()
    expect(compareObjects(createStateWithMethodsConfigA(), createStateWithMethodsConfigA_plain())).toBeFalsy()
    expect(compareObjects(createStateWithMethodsConfigA(), createStateWithMethodsConfigB())).toBeFalsy()
  })

  it.each`
    testId  | objA                                                      | objB                                                      | isEqual
    ${1.1}  | ${{ a: 'a', b: 'b' }}                                     | ${{ a: 'a', b: 'c' }}                                     | ${false}
    ${1.2}  | ${{ a: () => { }, b: null }}                              | ${{ a: false, b: () => { } }}                             | ${false}
    ${1.3}  | ${{ a: () => { } }}                                       | ${{ a: () => { } }}                                       | ${true}
    ${1.4}  | ${{ a: 'a', b: 'b', c: '3' }}                             | ${{ a: null, b: undefined, c: 3 }}                        | ${false}
    ${1.5}  | ${{ a: 0, b: 0, c: 0 }}                                   | ${{ a: null, b: undefined, c: '' }}                       | ${false}
    ${1.6}  | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 1) }}   | ${{ a: new Date(2000, 0, 1), b: null }}                   | ${false}
    ${1.7}  | ${{ a: null, b: new Date(2000, 0, 1) }}                   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 2) }}   | ${false}
    ${1.8}  | ${{ a: undefined, b: new Date(2000, 0, 1) }}              | ${{ a: new Date(2000, 0, 1), b: undefined }}              | ${false}
    ${1.9}  | ${{ a: null, b: undefined }}                              | ${{ a: undefined, b: null }}                              | ${false}
    ${1.10} | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}                                       | ${true}
    ${1.11} | ${{ a: [], b: {} }}                                       | ${{ a: {}, b: [] }}                                       | ${false}
    ${1.12} | ${{ a: {}, b: {} }}                                       | ${{ a: new Date(2000, 0, 1), b: () => { } }}              | ${false}
    ${1.13} | ${{ a: null, b: undefined }}                              | ${{ a: null, b: undefined }}                              | ${true}
  `('should return $isEqual. (testId: $testId)', ({ objA, objB, isEqual }) => {
    expect(compareObjects(objA, objB)).toBe(isEqual)
    expect(compareObjects(objB, objA)).toBe(isEqual)
  })

  it.each`
    testId  | arrA                                                      | arrB                                                      | isEqual
    ${2.1}  | ${[false]}                                                | ${[]}                                                     | ${false}
    ${2.2}  | ${[undefined]}                                            | ${[]}                                                     | ${false}
    ${2.3}  | ${[null]}                                                 | ${[]}                                                     | ${false}
    ${2.4}  | ${[null]}                                                 | ${[undefined]}                                            | ${false}
    ${2.5}  | ${[]}                                                     | ${[]}                                                     | ${true}
    ${2.6}  | ${[null, undefined, 0, '', false]}                        | ${[]}                                                     | ${false}
    ${2.7}  | ${[{ a: [] }, { a: [1] }]}                                | ${[{ a: [1] }, { a: [1] }]}                               | ${false}
    ${2.8}  | ${[{ a: [true] }, { a: [1] }]}                            | ${[{ a: [true] }, { a: [1] }]}                            | ${true}
    ${2.9}  | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${true}
    ${2.10} | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 1)]] }]}                     | ${false}
    ${2.11} | ${[() => { }]}                                            | ${[]}                                                     | ${false}
    ${2.12} | ${[() => { }]}                                            | ${[() => { }]}                                            | ${true}
    ${2.13} | ${[[[0]]]}                                                | ${[[[false]]]}                                            | ${false}
  `('should return $isEqual. (testId: $testId)', ({ arrA, arrB, isEqual }) => {
    expect(compareObjects(arrA, arrB)).toBe(isEqual)
    expect(compareObjects(arrB, arrA)).toBe(isEqual)
  })

  it.each`
    testId  | objA                                                      | objB                                                      | isEqual
    ${3.1}  | ${{ a: { a: false } }}                                    | ${{ a: { a: false } }}                                    | ${true}
    ${3.2}  | ${{ a: { a: false } }}                                    | ${{ a: { a: true } }}                                     | ${false}
    ${3.3}  | ${{ a: { a: null } }}                                     | ${{ a: { a: undefined } }}                                | ${false}
    ${3.4}  | ${{ a: { a: null } }}                                     | ${{ a: { b: undefined } }}                                | ${false}
    ${3.5}  | ${{ a: { a: [null] } }}                                   | ${{ a: { a: [undefined] } }}                              | ${false}
    ${3.6}  | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 0) } }}                        | ${true}
    ${3.7}  | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 1) } }}                        | ${false}
    ${3.8}  | ${{ a: { b: () => { } } }}                                | ${{ a: { b: () => { } } }}                                | ${true}
    ${3.9}  | ${{ a: { b: () => { } } }}                                | ${{ a: { b: [] } }}                                       | ${false}
    ${3.10} | ${{ a: { b: Symbol() } }}                                 | ${{ a: { b: Symbol() } }}                                 | ${false}
    ${3.11} | ${{ a: { b: () => { } } }}                                | ${{ a: { b: Symbol() } }}                                 | ${false}
    ${3.12} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: {} } }}}                                      | ${false}
    ${3.13} | ${{ a: { b: { c: { a: [] } } } }}                         | ${{ a: { b: { c: { a: [] } } } }}                         | ${true}
  `('should return $isEqual. (testId: $testId)', ({ objA, objB, isEqual }) => {
    expect(compareObjects(objA, objB)).toBe(isEqual)
    expect(compareObjects(objB, objA)).toBe(isEqual)
  })

  const instancedTestSubject = new TestSubject({ innerTestObject: new InnerTestSubject({ booleanValue: true }) })
  const plainTestSubject = toPlainObject(instancedTestSubject)

  it.each`
    testId | objA                                                        | objB                                                            | isEqual
    ${4.1}   | ${new TestSubject({})}                                      | ${new TestSubject({})}                                          | ${true}
    ${4.2}   | ${new TestSubject({ getterSetterDate: new Date(1900, 0) })} | ${new TestSubject({ getterSetterDate: new Date(1900, 1) })}     | ${false}
    ${4.3}   | ${instancedTestSubject}                                     | ${plainTestSubject}                                             | ${true}
  `('should return $isEqual. (testId: $testId)', ({ objA, objB, isEqual }) => {
    expect(compareObjects(objA, objB)).toBe(isEqual)
    expect(compareObjects(objB, objA)).toBe(isEqual)
  })

  it.each`
    testId | objA                                                        | objB                                                            | isEqual
    ${5.1}   | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: moment(new Date(1900, 0)) }}                             | ${true}
    ${5.2}   | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: moment(new Date(1900, 1)) }}                             | ${false}
    ${5.3}   | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: new Date(1900, 0) }}                                     | ${false}
  `('should return $isEqual. (testId: $testId)', ({ objA, objB, isEqual }) => {
    expect(compareObjects(objA, objB)).toBe(isEqual)
    expect(compareObjects(objB, objA)).toBe(isEqual)
  })
})
