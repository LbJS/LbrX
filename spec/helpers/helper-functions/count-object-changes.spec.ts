import { countObjectChanges } from 'lbrx/utils'
import moment from 'moment'
import { toPlainObject } from '__test__/functions'
import { InnerTestSubject, TestSubject } from '__test__/test-subjects'

describe('Helper Function - countObjectChanges():', () => {

  it.each`
    testId  | objA                                                      | objB                                                      | numOfDiffs
    ${1.01} | ${{ a: 'a', b: 'b' }}                                     | ${{ a: 'a', b: 'c' }}                                     | ${1}
    ${1.02} | ${{ a: () => { }, b: null }}                              | ${{ a: false, b: () => { } }}                             | ${2}
    ${1.03} | ${{ a: () => { } }}                                       | ${{ a: () => { } }}                                       | ${0}
    ${1.04} | ${{ a: 'a', b: 'b', c: '3' }}                             | ${{ a: null, b: undefined, c: 3 }}                        | ${3}
    ${1.05} | ${{ a: 0, b: 0, c: 0 }}                                   | ${{ a: null, b: undefined, c: '' }}                       | ${3}
    ${1.06} | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 1) }}   | ${{ a: new Date(2000, 0, 1), b: null }}                   | ${1}
    ${1.07} | ${{ a: null, b: new Date(2000, 0, 1) }}                   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 2) }}   | ${2}
    ${1.08} | ${{ a: undefined, b: new Date(2000, 0, 1) }}              | ${{ a: new Date(2000, 0, 1), b: undefined }}              | ${2}
    ${1.09} | ${{ a: null, b: undefined }}                              | ${{ a: undefined, b: null }}                              | ${2}
    ${1.10} | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}                                       | ${0}
    ${1.11} | ${{ a: [], b: {} }}                                       | ${{ a: {}, b: [] }}                                       | ${2}
    ${1.12} | ${{ a: {}, b: {} }}                                       | ${{ a: new Date(2000, 0, 1), b: () => { } }}              | ${2}
    ${1.13} | ${{ a: null, b: undefined }}                              | ${{ a: null, b: undefined }}                              | ${0}
  `('should count $numOfDiffs differences between two objects. (testId: $testId)', ({ objA, objB, numOfDiffs }) => {
    expect(countObjectChanges(objA, objB)).toBe(numOfDiffs)
    expect(countObjectChanges(objB, objA)).toBe(numOfDiffs)
  })

  it.each`
    testId  | arrA                                                      | arrB                                                      | numOfDiffs
    ${2.01} | ${[false]}                                                | ${[]}                                                     | ${1}
    ${2.02} | ${[undefined]}                                            | ${[]}                                                     | ${1}
    ${2.03} | ${[null]}                                                 | ${[]}                                                     | ${1}
    ${2.04} | ${[null]}                                                 | ${[undefined]}                                            | ${1}
    ${2.05} | ${[]}                                                     | ${[]}                                                     | ${0}
    ${2.06} | ${[null, undefined, 0, '', false]}                        | ${[]}                                                     | ${5}
    ${2.07} | ${[{ a: [] }, { a: [1] }]}                                | ${[{ a: [1] }, { a: [1] }]}                               | ${1}
    ${2.08} | ${[{ a: [true] }, { a: [1] }]}                            | ${[{ a: [true] }, { a: [1] }]}                            | ${0}
    ${2.09} | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${0}
    ${2.10} | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 1)]] }]}                     | ${1}
    ${2.11} | ${[() => { }]}                                            | ${[]}                                                     | ${1}
    ${2.12} | ${[() => { }]}                                            | ${[() => { }]}                                            | ${0}
    ${2.13} | ${[[[0]]]}                                                | ${[[[false]]]}                                            | ${1}
  `('should count $numOfDiffs differences between two arrays. (testId: $testId)', ({ arrA, arrB, numOfDiffs }) => {
    expect(countObjectChanges(arrA, arrB)).toBe(numOfDiffs)
    expect(countObjectChanges(arrB, arrA)).toBe(numOfDiffs)
  })

  it.each`
    testId  | objA                                                      | objB                                                      | numOfDiffs
    ${3.01} | ${{ a: { a: false } }}                                    | ${{ a: { a: false } }}                                    | ${0}
    ${3.02} | ${{ a: { a: false } }}                                    | ${{ a: { a: true } }}                                     | ${1}
    ${3.03} | ${{ a: { a: null } }}                                     | ${{ a: { a: undefined } }}                                | ${1}
    ${3.04} | ${{ a: { a: null } }}                                     | ${{ a: { b: undefined } }}                                | ${2}
    ${3.05} | ${{ a: { a: [null] } }}                                   | ${{ a: { a: [undefined] } }}                              | ${1}
    ${3.06} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 0) } }}                        | ${0}
    ${3.07} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 1) } }}                        | ${1}
    ${3.08} | ${{ a: { b: () => { } } }}                                | ${{ a: { b: () => { } } }}                                | ${0}
    ${3.09} | ${{ a: { b: () => { } } }}                                | ${{ a: { b: [] } }}                                       | ${1}
    ${3.10} | ${{ a: { b: Symbol() } }}                                 | ${{ a: { b: Symbol() } }}                                 | ${1}
    ${3.11} | ${{ a: { b: () => { } } }}                                | ${{ a: { b: Symbol() } }}                                 | ${1}
    ${3.12} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: {} } }}}                                      | ${1}
    ${3.13} | ${{ a: { b: { c: { a: [] } } } }}                         | ${{ a: { b: { c: { a: [] } } } }}                         | ${0}
  `('should count $numOfDiffs differences between two nested objects. (testId: $testId)', ({ objA, objB, numOfDiffs }) => {
    expect(countObjectChanges(objA, objB)).toBe(numOfDiffs)
    expect(countObjectChanges(objB, objA)).toBe(numOfDiffs)
  })

  const instancedTestSubject = new TestSubject({ innerTestObject: new InnerTestSubject({ booleanValue: true }) })
  const plainTestSubject = toPlainObject(instancedTestSubject)

  it.each`
    testId  | objA                                                        | objB                                                            | numOfDiffs
    ${4.01} | ${new TestSubject({})}                                      | ${new TestSubject({})}                                          | ${0}
    ${4.02} | ${new TestSubject({ getterSetterDate: new Date(1900, 0) })} | ${new TestSubject({ getterSetterDate: new Date(1900, 1) })}     | ${1}
    ${4.03} | ${instancedTestSubject}                                     | ${plainTestSubject}                                             | ${0}
  `('should count $numOfDiffs differences between two instanced objects. (testId: $testId)', ({ objA, objB, numOfDiffs }) => {
    expect(countObjectChanges(objA, objB)).toBe(numOfDiffs)
    expect(countObjectChanges(objB, objA)).toBe(numOfDiffs)
  })

  it.each`
    testId  | objA                                                        | objB                                                            | numOfDiffs
    ${5.01} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: moment(new Date(1900, 0)) }}                             | ${0}
    ${5.02} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: moment(new Date(1900, 1)) }}                             | ${1}
    ${5.03} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: new Date(1900, 0) }}                                     | ${1}
    ${5.03} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: {} }}                                                    | ${1}
  `('should count $numOfDiffs differences between moment properties. (testId: $testId)', ({ objA, objB, numOfDiffs }) => {
    expect(countObjectChanges(objA, objB)).toBe(numOfDiffs)
    expect(countObjectChanges(objB, objA)).toBe(numOfDiffs)
  })
})
