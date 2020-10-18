
describe(`Dev Tools Mode:`, () => {

  let activateStreamToDevTools: () => void
  let isDevTools: () => boolean

  beforeEach(async () => {
    const providerModule = await import(`provider`)
    activateStreamToDevTools = providerModule.activateStreamToDevTools
    isDevTools = providerModule.isDevTools
  })

  afterEach(() => {
    jest.resetModules()
  })

  it(`should deactivated by default.`, () => {
    expect(isDevTools()).toBeFalsy()
  })

  it(`should activated after enabling pushes.`, () => {
    activateStreamToDevTools()
    expect(isDevTools()).toBeTruthy()
  })
})
