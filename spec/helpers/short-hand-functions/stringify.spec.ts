import { stringify } from 'lbrx/internal/helpers'

describe(`Short Hand Function - stringify():`, () => {

  it(`should stringify object.`, () => {
    const obj = { firstName: `mike`, lastName: `test` }
    expect(stringify(obj)).toBe(JSON.stringify(obj))
  })

  it(`should stringify null if null is provided`, () => {
    expect(stringify(null)).toBe(JSON.stringify(null))
  })

  it(`should stringify object with a replacer.`, () => {
    const foo = { foundation: `Mozilla`, model: `box`, week: 45, transport: `car`, month: 7 }
    const replacer = (key: string, value: unknown) => typeof value === `string` ? undefined : value
    expect(stringify(foo, replacer)).toBe(JSON.stringify(foo, replacer))
  })

  it(`should stringify object with a space.`, () => {
    const foo = { foundation: `Mozilla`, model: `box`, week: 45, transport: `car`, month: 7 }
    const replacer = (key: string, value: unknown) => typeof value === `string` ? undefined : value
    expect(stringify(foo, replacer, `    `)).toBe(JSON.stringify(foo, replacer, `    `))
    expect(stringify(foo, null, 4)).toBe(JSON.stringify(foo, null, 4))
  })
})
