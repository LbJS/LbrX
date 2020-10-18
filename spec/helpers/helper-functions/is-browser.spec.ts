import { isBrowser } from 'lbrx/utils'
import MockBuilder from '__test__/mock-builder'

describe(`Helper Function - isBrowser():`, () => {

  it(`should return true if windows object exist.`, () => {
    MockBuilder.addWindowMock()
      .buildMocks()
    expect(isBrowser()).toBeTruthy()
  })

  it(`should return false if window object doesn't exist.`, () => {
    expect(isBrowser()).toBeFalsy()
  })
})
