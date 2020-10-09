import { logWarn } from 'lbrx/utils'

describe('Short Hand Function - logWarn():', () => {

  it('should log warning.', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    logWarn('test')
    expect(consoleWarnSpy).toBeCalledTimes(1)
  })

  it('should log warning with optional params.', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    logWarn('test', { a: 'test1' })
    logWarn('test', { a: 'test1' }, { a: 'test2' })
    expect(consoleWarnSpy).toBeCalledTimes(2)
  })
})
