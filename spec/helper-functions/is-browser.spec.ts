import MockBuilder from 'helpers/mock-builder'
import { isBrowser } from 'lbrx/helpers'

describe('Helper Function - isBrowser():', () => {

  it('should return true if windows object exist.', () => {
    MockBuilder.addWindowMock()
      .buildMocks()
    expect(isBrowser()).toBeTruthy()
  })

  it("should return false if window object doesn't exist.", () => {
    expect(isBrowser()).toBeFalsy()
  })
})
