import { mergeObjects } from 'lbrx/utils'
import moment from 'moment'
import { MergedTestSubjectFactory } from '__test__/factories'
import { toPlainObject } from '__test__/functions'
import { InnerTestSubject, MergeTestSubject, TestSubject } from '__test__/test-subjects'

describe(`Helper Function - mergeObjects():`, () => {

  const func = () => { }
  const symbol = Symbol()

  it(`should return a merged object.`, () => {
    const [oA, oB, oC]: MergeTestSubject[] = MergedTestSubjectFactory.createMergeTestSubject()
    const objA = oA
    const objB = oB
    const expectedObj = oC
    const mergedObj = mergeObjects(objA, objB)
    expect(mergedObj).toStrictEqual(expectedObj)
  })

  it.each`
    testId  | objA                                                      | objB                                                      | resultObj
    ${1.01} | ${{ a: `a`, b: `b` }}                                     | ${{ a: `a`, b: `c` }}                                     | ${{ a: `a`, b: `c` }}
    ${1.02} | ${{ a: func, b: null }}                                   | ${{ a: false, b: func }}                                  | ${{ a: false, b: func }}
    ${1.03} | ${{ a: func }}                                            | ${{ a: func }}                                            | ${{ a: func }}
    ${1.04} | ${{ a: `a`, b: `b`, c: `3` }}                             | ${{ a: null, b: undefined, c: 3 }}                        | ${{ a: null, b: undefined, c: 3 }}
    ${1.05} | ${{ a: 0, b: 0, c: 0 }}                                   | ${{ a: null, b: undefined, c: `` }}                       | ${{ a: null, b: undefined, c: `` }}
    ${1.06} | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 1) }}   | ${{ a: new Date(2000, 0, 1), b: null }}                   | ${{ a: new Date(2000, 0, 1), b: null }}
    ${1.07} | ${{ a: null, b: new Date(2000, 0, 1) }}                   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 2) }}   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 2) }}
    ${1.08} | ${{ a: undefined, b: new Date(2000, 0, 1) }}              | ${{ a: new Date(2000, 0, 1), b: undefined }}              | ${{ a: new Date(2000, 0, 1), b: undefined }}
    ${1.09} | ${{ a: null, b: undefined }}                              | ${{ a: undefined, b: null }}                              | ${{ a: undefined, b: null }}
    ${1.10} | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}
    ${1.11} | ${{ a: [], b: {} }}                                       | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}
    ${1.12} | ${{ a: {}, b: {} }}                                       | ${{ a: new Date(2000, 0, 1), b: func }}                   | ${{ a: new Date(2000, 0, 1), b: func }}
    ${1.13} | ${{ a: null, b: undefined }}                              | ${{ a: null, b: undefined }}                              | ${{ a: null, b: undefined }}
  `(`should return a merged object. (testId: $testId)`, ({ objA, objB, resultObj }) => {
    expect(mergeObjects(objA, objB)).toStrictEqual(resultObj)
  })

  it.each`
    testId  | arrA                                                      | arrB                                                      | resultArr
    ${2.01} | ${[false]}                                                | ${[]}                                                     | ${[false]}
    ${2.02} | ${[undefined]}                                            | ${[]}                                                     | ${[undefined]}
    ${2.03} | ${[null]}                                                 | ${[]}                                                     | ${[null]}
    ${2.04} | ${[null]}                                                 | ${[undefined]}                                            | ${[undefined]}
    ${2.05} | ${[]}                                                     | ${[]}                                                     | ${[]}
    ${2.06} | ${[null, undefined, 0, ``, false]}                        | ${[]}                                                     | ${[null, undefined, 0, ``, false]}
    ${2.07} | ${[{ a: [] }, { a: [1] }]}                                | ${[{ a: [1] }, { a: [1] }]}                               | ${[{ a: [1] }, { a: [1] }]}
    ${2.08} | ${[{ a: [true] }, { a: [1] }]}                            | ${[{ a: [true] }, { a: [1] }]}                            | ${[{ a: [true] }, { a: [1] }]}
    ${2.09} | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 0)]] }]}
    ${2.10} | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 1)]] }]}                     | ${[{ a: [{}, [new Date(2000, 1)]] }]}
    ${2.11} | ${[func]}                                                 | ${[]}                                                     | ${[func]}
    ${2.12} | ${[func]}                                                 | ${[func]}                                                 | ${[func]}
    ${2.13} | ${[[[0]]]}                                                | ${[[[false]]]}                                            | ${[[[false]]]}
  `(`should return a merged array. (testId: $testId)`, ({ arrA, arrB, resultArr }) => {
    expect(mergeObjects(arrA, arrB)).toStrictEqual(resultArr)
  })

  it.each`
    testId  | objA                                                      | objB                                                      | resultObj
    ${3.01} | ${{ a: { a: false } }}                                    | ${{ a: { a: false } }}                                    | ${{ a: { a: false } }}
    ${3.02} | ${{ a: { a: false } }}                                    | ${{ a: { a: true } }}                                     | ${{ a: { a: true } }}
    ${3.03} | ${{ a: { a: null } }}                                     | ${{ a: { a: undefined } }}                                | ${{ a: { a: undefined } }}
    ${3.04} | ${{ a: { a: null } }}                                     | ${{ a: { b: undefined } }}                                | ${{ a: { a: null, b: undefined } }}
    ${3.05} | ${{ a: { a: [null] } }}                                   | ${{ a: { a: [undefined] } }}                              | ${{ a: { a: [undefined] } }}
    ${3.06} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 0) } }}
    ${3.07} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 1) } }}                        | ${{ a: { b: new Date(2000, 1) } }}
    ${3.08} | ${{ a: { b: func } }}                                     | ${{ a: { b: func } }}                                     | ${{ a: { b: func } }}
    ${3.09} | ${{ a: { b: func } }}                                     | ${{ a: { b: [] } }}                                       | ${{ a: { b: [] } }}
    ${3.10} | ${{ a: { b: symbol } }}                                   | ${{ a: { b: symbol } }}                                   | ${{ a: { b: symbol } }}
    ${3.11} | ${{ a: { b: func } }}                                     | ${{ a: { b: symbol } }}                                   | ${{ a: { b: symbol } }}
    ${3.12} | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: {} } }}                                       | ${{ a: { b: {} } }}
    ${3.13} | ${{ a: { b: { c: { a: [] } } } }}                         | ${{ a: { b: { c: { a: [] } } } }}                         | ${{ a: { b: { c: { a: [] } } } }}
  `(`should return a merged object. (testId: $testId)`, ({ objA, objB, resultObj }) => {
    expect(mergeObjects(objA, objB)).toStrictEqual(resultObj)
  })

  const instancedTestSubject = new TestSubject({ innerTestObject: new InnerTestSubject({ booleanValue: true }) })
  const plainTestSubject = toPlainObject(instancedTestSubject)

  it.each`
    testId  | objA                                                        | objB                                                            | resultObj
    ${4.01} | ${new TestSubject({})}                                      | ${new TestSubject({})}                                          | ${new TestSubject({})}
    ${4.02} | ${new TestSubject({ getterSetterDate: new Date(1900, 0) })} | ${new TestSubject({ getterSetterDate: new Date(1900, 1) })}     | ${new TestSubject({ getterSetterDate: new Date(1900, 1) })}
    ${4.03} | ${instancedTestSubject}                                     | ${plainTestSubject}                                             | ${instancedTestSubject}
  `(`should return a merged object. (testId: $testId)`, ({ objA, objB, resultObj }) => {
    expect(mergeObjects(objA, objB)).toStrictEqual(resultObj)
  })

  it.each`
    testId  | objA                                                        | objB                                                            | resultObj
    ${5.01} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: moment(new Date(1900, 0)) }}                             | ${{ a: moment(new Date(1900, 0)) }}
    ${5.02} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: moment(new Date(1900, 1)) }}                             | ${{ a: moment(new Date(1900, 1)) }}
    ${5.03} | ${{ a: moment(new Date(1900, 0)) }}                         | ${{ a: new Date(1900, 0) }}                                     | ${{ a: new Date(1900, 0) }}
  `(`should return a merged object. (testId: $testId)`, ({ objA, objB, resultObj }) => {
    expect(mergeObjects(objA, objB)).toStrictEqual(resultObj)
  })

  it.each`
    testId  | objA                                                      | objB                                                      | resultObj
    ${6.01} | ${{ a: [{ a: `a` }, { a: `a` }] }}                        | ${{ a: `a` }}                                             | ${{ a: `a` }}
    ${6.02} | ${{ a: `a` }}                                             | ${{ a: [{ a: `a` }, { a: `a` }] }}                        | ${{ a: [{ a: `a` }, { a: `a` }] }}
    ${6.03} | ${{ a: new Error(`a`) }}                                  | ${{ a: new Error(`b`) }}                                  | ${{ a: new Error(`b`) }}
    `(`should return a merged object. (testId: $testId)`, ({ objA, objB, resultObj }) => {
    expect(mergeObjects(objA, objB)).toStrictEqual(resultObj)
  })

  it.each`
    testId  | objA                                                      | objB                                                      | resultObj
    ${7.01} | ${{ a: { a: `a` } }}                                      | ${{ a: { b: `b` } }}                                      | ${{ a: { a: `a`, b: `b` } }}
    ${7.02} | ${{ a: { a: `a` } }}                                      | ${{ b: { b: `b` } }}                                      | ${{ a: { a: `a` }, b: { b: `b` } }}
    ${7.03} | ${[{ a: `a` }, { a: `a` }]}                               | ${[{ b: `b` }]}                                           | ${[{ a: `a`, b: `b` }, { a: `a` }]}
    ${7.04} | ${{ a: [{ a: `a` }, { a: `a` }] }}                        | ${{ a: [{ b: `b` }] }}                                    | ${{ a: [{ a: `a`, b: `b` }, { a: `a` }] }}
  `(`should return a merged object. (testId: $testId)`, ({ objA, objB, resultObj }) => {
    expect(mergeObjects(objA, objB)).toStrictEqual(resultObj)
    expect(mergeObjects(objB, objA)).toStrictEqual(resultObj)
  })
})
