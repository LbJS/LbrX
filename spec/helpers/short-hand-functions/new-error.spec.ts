import { newError } from 'lbrx/internal/helpers'

describe(`Short Hand Function - newError():`, () => {

  it(`should return new error.`, () => {
    const error = newError()
    expect(error).toBeInstanceOf(Error)
  })

  it(`should return new error with an message.`, () => {
    const errorMsg = `message`
    const error = newError(errorMsg)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe(errorMsg)
  })
})
