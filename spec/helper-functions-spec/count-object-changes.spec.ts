import { splitToObject } from 'helpers'
import { countObjectChanges } from 'lbrx/helpers'
import { MergeTestSubject } from 'test-subjects'

describe('Helper Function - countObjectChanges():', () => {

  const expectedChangesA = 2
  it(`should count ${expectedChangesA} changes between two objects. {testId: 1}`, () => {
    const [objA, objB]: any = splitToObject(<MergeTestSubject>{
      a: ['a', 'a'],
      b: ['b', ''], // 1
      c: [() => { }, () => { }],
      d: [false, () => { }],
    }) as any
    expect(countObjectChanges(objA, objB)).toBe(expectedChangesA)
  })

  const expectedChangesB = 3
  it(`should count ${expectedChangesB} changes between two objects. {testId: 2}`, () => {
    const [objA, objB]: any = splitToObject(<MergeTestSubject>{
      objA: {
        a: ['a', 'a'],
        b: ['b', null], // 1
        c: [undefined, 'c'], // 2
        d: [4, '4'], // 3
      }
    }) as any
    expect(countObjectChanges(objA, objB)).toBe(expectedChangesB)
  })

  const expectedChangesC = 3
  it(`should count ${expectedChangesC} changes between two objects. {testId: 3}`, () => {
    const [objA, objB]: any = splitToObject(<MergeTestSubject>{
      objA: {
        a: [new Date(2000, 0, 1), new Date(2000, 0, 1)],
        b: [new Date(2000, 0, 1), new Date(2000, 0, 2)], // 1
        c: [new Date(2000, 0, 1), undefined], // 2
        d: [undefined, new Date(2000, 0, 1)], // 3
      }
    }) as any
    expect(countObjectChanges(objA, objB)).toBe(expectedChangesC)
  })

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
})
