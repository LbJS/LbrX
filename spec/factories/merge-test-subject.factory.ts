import { splitToObject } from 'helpers'
import { MergeTestSubject } from 'test-subjects'

export class MergedTestSubjectFactory {

  public static createMergeTestSubject(): [MergeTestSubject, MergeTestSubject, MergeTestSubject] {
    // [obj1, obj2, expectedObj]
    return splitToObject(<MergeTestSubject>{
      a: [1, 0, 0],
      b: [null, 0, 0],
      c: ['', null, null],
      d: [null, null, null],
      e: [undefined, 0, 0],
      f: ['', undefined, ''],
      g: [[1], [2], [2]],
      h: [null, [], []],
      i: [[], null, null],
      j: [undefined, [], []],
      k: [[], undefined, []],
      l: [new Date(2020, 0), new Date(2020, 1), new Date(2020, 1)],
      m: [null, new Date(2020, 1), new Date(2020, 1)],
      n: [new Date(2020, 0), null, null],
      o: [undefined, new Date(2020, 1), new Date(2020, 1)],
      p: [new Date(2020, 0), undefined, new Date(2020, 0)],
      q: [true, false, false],
      r: [false, true, true],
      s: [null, false, false],
      t: [true, null, null],
      v: [undefined, true, true],
      u: [true, undefined, true],
      objA: {
        a: [1, 0, 0],
        b: [null, 0, 0],
        c: ['', null, null],
        d: [null, null, null],
        e: [undefined, 0, 0],
        f: ['', undefined, ''],
        g: [[1], [2], [2]],
        h: [null, [], []],
        i: [[], null, null],
        j: [undefined, [], []],
        k: [[], undefined, []],
        l: [new Date(2020, 0), new Date(2020, 1), new Date(2020, 1)],
        m: [null, new Date(2020, 1), new Date(2020, 1)],
        n: [new Date(2020, 0), null, null],
        o: [undefined, new Date(2020, 1), new Date(2020, 1)],
        p: [new Date(2020, 0), undefined, new Date(2020, 0)],
        q: [true, false, false],
        r: [false, true, true],
        s: [null, false, false],
        t: [true, null, null],
        v: [undefined, true, true],
        u: [true, undefined, true],
      },
      objB: {
        a: ['', undefined, '']
      },
      objC: {
        nestedObj: {
          deepNestedObj: {
            a: [undefined, '', '']
          }
        }
      }
    }) as [MergeTestSubject, MergeTestSubject, MergeTestSubject]
  }
}
