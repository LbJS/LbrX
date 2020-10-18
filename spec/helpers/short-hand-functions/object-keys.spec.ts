import { objectKeys } from 'lbrx/internal/helpers'

describe(`Short Hand Function - objectKeys():`, () => {

  it(`should return object's keys.`, () => {
    expect(objectKeys({ a: `aaa`, b: `bbb` })).toStrictEqual([`a`, `b`])
  })
})
