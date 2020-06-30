import { splitToObject } from 'helpers/functions'
import { MergeTestSubject } from 'helpers/test-subjects'
import { countObjectChanges } from 'lbrx/helpers'

describe('Helper Function - countObjectChanges():', () => {

  const expectedChangesD = 2
  it(`should count ${expectedChangesD} changes between two objects. {testId: 4}`, () => {
    const [objA, objB]: any = splitToObject(<MergeTestSubject>{
      objC: {
        nestedObj: {
          deepNestedObj: {
            a: [[new Date(2000, 0), { a: 'a' }], [new Date(2000, 0), { a: 'a', b: 'b' }, () => { }]] // 1, 2
          }
        }
      }
    }) as any
    expect(countObjectChanges(objA, objB)).toBe(expectedChangesD)
  })

  const expectedChangesG = 6
  it(`should count ${expectedChangesG} changes between two objects. {testId: 5}`, () => {
    const [objA, objB]: any = splitToObject(<MergeTestSubject>{
      a: ['a', 'a'],
      b: ['b', ''], // 1
      objA: {
        a: [new Date(2000, 0, 1), new Date(2000, 0, 1)],
        b: [new Date(2000, 0, 1), new Date(2000, 0, 2)], // 2
        c: [new Date(2000, 0, 1), undefined], // 3
        d: [undefined, new Date(2000, 0, 1)], // 4
      },
      objC: {
        nestedObj: {
          deepNestedObj: {
            a: [[new Date(2000, 0), { a: 'a' }], [new Date(2000, 0), { a: 'a', b: 'b' }, () => { }]] // 5, 6
          }
        }
      }
    }) as any
    expect(countObjectChanges(objA, objB)).toBe(expectedChangesG)
  })

  it.each`
    testId | objA                                                      | objB                                                      | numOfDiffs
    ${1}   | ${{ a: 'a', b: 'b' }}                                     | ${{ a: 'a', b: 'c' }}                                     | ${1}
    ${2}   | ${{ a: () => { }, b: null }}                              | ${{ a: false, b: () => { } }}                             | ${2}
    ${3}   | ${{ a: () => { } }}                                       | ${{ a: () => { }, }}                                      | ${0}
    ${4}   | ${{ a: 'a', b: 'b', c: '3' }}                             | ${{ a: null, b: undefined, c: 3 }}                        | ${3}
    ${5}   | ${{ a: 0, b: 0, c: 0 }}                                   | ${{ a: null, b: undefined, c: '' }}                       | ${3}
    ${6}   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 1) }}   | ${{ a: new Date(2000, 0, 1), b: null }}                   | ${1}
    ${7}   | ${{ a: null, b: new Date(2000, 0, 1) }}                   | ${{ a: new Date(2000, 0, 1), b: new Date(2000, 0, 2) }}   | ${2}
    ${8}   | ${{ a: undefined, b: new Date(2000, 0, 1) }}              | ${{ a: new Date(2000, 0, 1), b: undefined }}              | ${2}
    ${9}   | ${{ a: null, b: undefined }}                              | ${{ a: undefined, b: null }}                              | ${2}
    ${10}  | ${{ a: {}, b: [] }}                                       | ${{ a: {}, b: [] }}                                       | ${0}
    ${11}  | ${{ a: [], b: {} }}                                       | ${{ a: {}, b: [] }}                                       | ${2}
    ${12}  | ${{ a: {}, b: {} }}                                       | ${{ a: new Date(2000, 0, 1), b: () => { } }}              | ${2}
    ${13}  | ${{ a: null, b: undefined }}                              | ${{ a: null, b: undefined }}                              | ${0}
  `('should count $numOfDiffs differences between two objects. (testId: $testId)', ({ objA, objB, numOfDiffs }) => {
    expect(countObjectChanges(objA, objB)).toBe(numOfDiffs)
    expect(countObjectChanges(objB, objA)).toBe(numOfDiffs)
  })

  it.each`
    testId | arrA                                                      | arrB                                                      | numOfDiffs
    ${1}   | ${[false]}                                                | ${[]}                                                     | ${1}
    ${2}   | ${[undefined]}                                            | ${[]}                                                     | ${1}
    ${3}   | ${[null]}                                                 | ${[]}                                                     | ${1}
    ${4}   | ${[null]}                                                 | ${[undefined]}                                            | ${1}
    ${5}   | ${[]}                                                     | ${[]}                                                     | ${0}
    ${6}   | ${[null, undefined, 0, '', false]}                        | ${[]}                                                     | ${5}
    ${7}   | ${[{ a: [] }, { a: [1] }]}                                | ${[{ a: [1] }, { a: [1] }]}                               | ${1}
    ${8}   | ${[{ a: [true] }, { a: [1] }]}                            | ${[{ a: [true] }, { a: [1] }]}                            | ${0}
    ${9}   | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${0}
    ${10}  | ${[{ a: [{}, [new Date(2000, 0)]] }]}                     | ${[{ a: [{}, [new Date(2000, 1)]] }]}                     | ${1}
    ${11}  | ${[() => { }]}                                            | ${[]}                                                     | ${1}
    ${12}  | ${[() => { }]}                                            | ${[() => { }]}                                            | ${0}
    ${13}  | ${[[[0]]]}                                                | ${[[[false]]]}                                            | ${1}
  `('should count $numOfDiffs differences between two arrays. (testId: $testId)', ({ arrA, arrB, numOfDiffs }) => {
    expect(countObjectChanges(arrA, arrB)).toBe(numOfDiffs)
    expect(countObjectChanges(arrB, arrA)).toBe(numOfDiffs)
  })

  it.each`
    testId | objA                                                      | arrB                                                      | numOfDiffs
    ${1}   | ${{ a: { a: false } }}                                    | ${{ a: { a: false } }}                                    | ${0}
    ${2}   | ${{ a: { a: false } }}                                    | ${{ a: { a: true } }}                                     | ${1}
    ${3}   | ${{ a: { a: null } }}                                     | ${{ a: { a: undefined } }}                                | ${1}
    ${4}   | ${{ a: { a: null } }}                                     | ${{ a: { b: undefined } }}                                | ${2}
    ${5}   | ${{ a: { a: [null] } }}                                   | ${{ a: { a: [undefined] } }}                              | ${1}
    ${6}   | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 0) } }}                        | ${0}
    ${7}   | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: new Date(2000, 1) } }}                        | ${1}
    ${8}   | ${{ a: { b: () => { } } }}                                | ${{ a: { b: () => { } } }}                                | ${0}
    ${9}   | ${{ a: { b: () => { } } }}                                | ${{ a: { b: [] } }}                                       | ${1}
    ${10}  | ${{ a: { b: Symbol() } }}                                 | ${{ a: { b: Symbol() } }}                                 | ${1}
    ${11}  | ${{ a: { b: () => { } } }}                                | ${{ a: { b: Symbol() } }}                                 | ${1}
    ${12}  | ${{ a: { b: new Date(2000, 0) } }}                        | ${{ a: { b: {} } }}}                                      | ${1}
    ${13}  | ${{ a: { b: { c: { a: [] } } } }}                         | ${{ a: { b: { c: { a: [] } } } }}                         | ${0}
  `('should count $numOfDiffs differences between two nested objects. (testId: $testId)', ({ objA, arrB, numOfDiffs }) => {
    expect(countObjectChanges(objA, arrB)).toBe(numOfDiffs)
    expect(countObjectChanges(arrB, objA)).toBe(numOfDiffs)
  })
})
