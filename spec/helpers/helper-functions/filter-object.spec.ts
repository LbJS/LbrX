import { filterObject } from 'lbrx/utils'

describe(`Helper Function - filterObject():`, () => {

  it(`should filter the provided object by the given keys.`, () => {
    const obj = {
      a: `a`,
      b: `b`,
      c: `c`,
    }
    const expectedObj = {
      b: `b`,
    }
    expect(filterObject(obj, [`a`, `c`])).toStrictEqual(expectedObj)
    expect(filterObject(obj, [`a`, `c`], true)).toStrictEqual(expectedObj)
    expect(filterObject(obj, [`b`], false)).toStrictEqual(expectedObj)
  })

  it(`should return undefined if undefined is provided.`, () => {
    expect(filterObject(undefined!, [])).toBe(undefined)
  })

  it(`should return null if undefined is null.`, () => {
    expect(filterObject(null!, [])).toBe(null)
  })
})
