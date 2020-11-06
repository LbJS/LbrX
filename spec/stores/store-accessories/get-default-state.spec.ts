import { getDefaultState } from 'lbrx/internal/stores/store-accessories'

describe(`Store Accessories - getDefaultState():`, () => {

  it(`should return the expected default state.`, () => {
    const expectedDefaultState = {
      value: null,
      isPaused: false,
      isLoading: false,
      isHardResettings: false,
      error: null,
    }
    expect(getDefaultState()).toStrictEqual(expectedDefaultState)
  })

  it(`should always return a new instance of a default state.`, () => {
    expect(getDefaultState()).not.toBe(getDefaultState())
  })
})
