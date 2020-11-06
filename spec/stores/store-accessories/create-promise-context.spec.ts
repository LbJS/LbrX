import { createPromiseContext } from 'lbrx/internal/stores/store-accessories'

describe(`Store Accessories - createPromiseContext():`, () => {

  it(`should return the expected promise context.`, () => {
    const expectedPromiseContext = {
      promise: null,
      isCancelled: false,
    }
    expect(createPromiseContext()).toStrictEqual(expectedPromiseContext)
  })

  it(`should always return a new instance of a promise context.`, () => {
    expect(createPromiseContext()).not.toBe(createPromiseContext())
  })
})
