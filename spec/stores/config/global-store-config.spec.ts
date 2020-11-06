import { getDefaultGlobalStoreConfig as getDefaultGlobalStoreConfig_type, getGlobalStoreConfig as getGlobalStoreConfig_type, setGlobalStoreConfig as setGlobalStoreConfig_type } from 'lbrx/internal/stores/config'

describe(`Store Accessories - global store config:`, () => {

  let getDefaultGlobalStoreConfig: typeof getDefaultGlobalStoreConfig_type
  let getGlobalStoreConfig: typeof getGlobalStoreConfig_type
  let setGlobalStoreConfig: typeof setGlobalStoreConfig_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    getDefaultGlobalStoreConfig = provider.getDefaultGlobalStoreConfig
    getGlobalStoreConfig = provider.getGlobalStoreConfig
    setGlobalStoreConfig = provider.setGlobalStoreConfig
  })

  it(`should return the default global store config if no other global store config were provided.`, () => {
    expect(getGlobalStoreConfig()).toStrictEqual(getDefaultGlobalStoreConfig())
  })

  it(`should always return a new instance of a global store config.`, () => {
    expect(getGlobalStoreConfig()).not.toBe(getGlobalStoreConfig())
  })

  it(`should allow to change the global config.`, () => {
    setGlobalStoreConfig({
      storageDebounceTime: 1000,
    })
    expect(getGlobalStoreConfig()).not.toStrictEqual(getDefaultGlobalStoreConfig())
    expect(getGlobalStoreConfig().storageDebounceTime).toBe(1000)
  })
})
