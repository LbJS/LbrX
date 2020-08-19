
describe('Dev Tools Mode:', () => {

  let activateDevToolsPushes: () => void
  let isDevTools: () => boolean

  beforeEach(async () => {
    const providerModule = await import('provider')
    activateDevToolsPushes = providerModule.activateDevToolsStream
    isDevTools = providerModule.isDevTools
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should deactivated by default.', () => {
    expect(isDevTools()).toBeFalsy()
  })

  it('should activated after enabling pushes.', () => {
    activateDevToolsPushes()
    expect(isDevTools()).toBeTruthy()
  })
})
