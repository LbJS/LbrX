import { enableProdMode as enableProdMode_type, isDev as isDev_type } from 'lbrx/internal/core'

describe(`lbrx-mode:`, () => {

  let enableProdMode: typeof enableProdMode_type
  let isDev: typeof isDev_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    enableProdMode = provider.enableProdMode
    isDev = provider.isDev
  })

  it(`should be in development mode by default.`, () => {
    expect(isDev()).toBeTruthy()
  })

  it(`should be in production mode after enabling it.`, () => {
    enableProdMode()
    expect(isDev()).toBeFalsy()
  })
})
