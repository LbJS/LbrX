
describe('LbrX Mode:', () => {

  let enableProdMode: () => void
  let isDev: () => boolean

  beforeEach(async () => {
    const providerModule = await import('provider.module')
    enableProdMode = providerModule.enableProdMode
    isDev = providerModule.isDev
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should be in development mode by default.', () => {
    expect(isDev()).toBeTruthy()
  })

  it('should be in production mode after enabling it.', () => {
    enableProdMode()
    expect(isDev()).toBeFalsy()
  })
})
