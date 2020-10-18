import { objectAssign } from 'lbrx/internal/helpers'

describe(`Short Hand Function - objectAssign():`, () => {

  it(`should merge objects.`, () => {
    expect(objectAssign({ a: `a` }, { b: `b` })).toStrictEqual({ a: `a`, b: `b` })
    expect(objectAssign({ a: `a` }, { b: `b` }, { c: `c` })).toStrictEqual({ a: `a`, b: `b`, c: `c` })
    expect(objectAssign({ a: `a` }, { b: `b` }, { c: `c` }, { d: `d` })).toStrictEqual({ a: `a`, b: `b`, c: `c`, d: `d` })
    expect(objectAssign({ a: `a` }, { b: `b` }, { c: `c` }, { d: `d` }, { e: `e` }))
      .toStrictEqual({ a: `a`, b: `b`, c: `c`, d: `d`, e: `e` })
  })
})
