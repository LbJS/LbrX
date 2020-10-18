import { assert } from 'lbrx/utils'

describe(`Helper Function - assert():`, () => {

  it(`should not throw an error if the condition returns true.`, () => {
    expect(() => {
      assert(true, `error`)
    }).not.toThrow()
  })

  it(`should throw an error if the condition returns false.`, () => {
    expect(() => {
      assert(true, `error`)
    }).not.toThrow()
  })
})
