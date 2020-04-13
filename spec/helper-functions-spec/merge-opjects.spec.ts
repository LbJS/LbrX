import { mergeObjects } from 'lbrx/helpers'
import { MergeTestSubject } from 'test-subjects'

describe('Helper Function - mergeObjects():', () => {

  it('should result the expected properties values after merging.', () => {
    const objA: MergeTestSubject = {
      a: null,
      b: 'b',
      c: null,
      d: {},
      e: 'e',
      g: new Date(2019, 0),
    }
    const objB: MergeTestSubject = {
      a: 'a',
      b: null,
      c: {},
      d: null,
      f: 0,
      g: new Date(2020, 0),
    }
    const mergedObj = mergeObjects(objA, objB)
    expect(mergedObj).toStrictEqual(<MergeTestSubject>{
      a: 'a',
      b: null,
      c: {},
      d: null,
      e: 'e',
      f: 0,
      g: new Date(2020, 0),
    })
  })

  it('should result the expected properties values for nested objects after merging.', () => {
    const objA: MergeTestSubject = {
      objA: {
        a: null,
        b: 'b',
        c: null,
        d: {},
        e: 'e',
        g: null,
      },
      objB: {
        a: 'a'
      }
    }
    const objB: MergeTestSubject = {
      objA: {
        a: 'a',
        b: null,
        c: {},
        d: null,
        f: 0,
        g: new Date(2020, 0),
      },
      objC: {
        nestedObj: {
          deepNestedObj: {
            a: 'a'
          }
        }
      }
    }
    const mergedObj = mergeObjects(objA, objB)
    expect(mergedObj).toStrictEqual(<MergeTestSubject>{
      objA: {
        a: 'a',
        b: null,
        c: {},
        d: null,
        e: 'e',
        f: 0,
        g: new Date(2020, 0),
      },
      objB: {
        a: 'a'
      },
      objC: {
        nestedObj: {
          deepNestedObj: {
            a: 'a'
          }
        }
      }
    })
  })

  it('should result the expected properties values for deep nested objects after merging.', () => {
    const objA: MergeTestSubject = {
      objC: {
        nestedObj: {
          deepNestedObj: {
            a: 'a'
          }
        }
      }
    }
    const objB: MergeTestSubject = {
      objC: {
        nestedObj: {
          deepNestedObj: {
            b: 'b'
          }
        }
      }
    }
    const mergedObj = mergeObjects(objA, objB)
    expect(mergedObj).toStrictEqual(<MergeTestSubject>{
      objC: {
        nestedObj: {
          deepNestedObj: {
            a: 'a',
            b: 'b',
          }
        }
      }
    })
  })

  it('should result the expected property array values after merging.', () => {
    const objA: MergeTestSubject = {
      a: [1],
      b: [2],
      c: null,
      d: [],
      objA: {
        a: [1],
        b: [2],
        c: [3],
      }
    }
    const objB: MergeTestSubject = {
      a: ['a'],
      b: null,
      c: ['c'],
      e: [],
      objA: {
        a: ['a'],
        b: null,
      }
    }
    const mergedObj = mergeObjects(objA, objB)
    expect(mergedObj).toStrictEqual(<MergeTestSubject>{
      a: ['a'],
      b: null,
      c: ['c'],
      d: [],
      e: [],
      objA: {
        a: ['a'],
        b: null,
        c: [3],
      }
    })
  })

  it('should result the expected properties array/ object values after merging.', () => {
    const objA: MergeTestSubject = {
      a: {},
      b: [],
      c: [{}],
      d: null,
      e: [],
      f: {},
      g: [{}],
    }
    const objB: MergeTestSubject = {
      a: [],
      b: {},
      c: null,
      d: [{}],
      e: new Date(2000, 0),
      f: new Date(2000, 0),
    }
    const mergedObj = mergeObjects(objA, objB)
    expect(mergedObj).toStrictEqual(<MergeTestSubject>{
      a: [],
      b: {},
      c: null,
      d: [{}],
      e: new Date(2000, 0),
      f: new Date(2000, 0),
      g: [{}],
    })
  })
})
