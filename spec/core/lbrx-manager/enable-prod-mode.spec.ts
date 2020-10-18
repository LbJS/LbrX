import { isDev as isDev_type, LbrXManager as LbrXManager_type } from 'lbrx/internal/core'

describe(`LbrXManager enableProdMode():`, () => {

  let LbrXManager: typeof LbrXManager_type
  let isDev: typeof isDev_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    LbrXManager = provider.LbrXManager
    isDev = provider.isDev
  })

  it(`should enable production mode.`, () => {
    LbrXManager.enableProdMode()
    expect(isDev()).toBeFalsy()
  })

  it(`should return LbrXManager.`, () => {
    const value = LbrXManager.enableProdMode()
    expect(value).toStrictEqual(LbrXManager)
  })
})
