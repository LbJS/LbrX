import { logError } from 'lbrx/helpers'

describe('Short Hand Function - logError():', () => {

  it('should log warning with optional params.', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    logError('test')
    expect(consoleErrorSpy).toBeCalledTimes(1)
  })

  it('should log warning with optional params.', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    logError('test', new Error('Test'))
    expect(consoleErrorSpy).toBeCalledTimes(1)
  })
})
