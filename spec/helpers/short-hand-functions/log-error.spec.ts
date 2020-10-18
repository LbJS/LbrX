import { logError } from 'lbrx/utils'

describe(`Short Hand Function - logError():`, () => {

  it(`should log error.`, () => {
    const consoleErrorSpy = jest.spyOn(console, `error`).mockImplementation()
    logError(`test`)
    expect(consoleErrorSpy).toBeCalledTimes(1)
  })

  it(`should log error with optional params.`, () => {
    const consoleErrorSpy = jest.spyOn(console, `error`).mockImplementation()
    logError(`test`, new Error(`Test`))
    logError(`test`, new Error(`Test1`), new Error(`Test2`))
    expect(consoleErrorSpy).toBeCalledTimes(2)
  })
})
