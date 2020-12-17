import { getDefaultGlobalListStoreConfig as getDefaultGlobalListStoreConfig_type, getGlobalListStoreConfig as getGlobalListStoreConfig_type, setGlobalListStoreConfig as setGlobalListStoreConfig_type } from 'lbrx/internal/stores/config'

describe(`Store Accessories - global list store config:`, () => {

  let getDefaultGlobalListStoreConfig: typeof getDefaultGlobalListStoreConfig_type
  let getGlobalListStoreConfig: typeof getGlobalListStoreConfig_type
  let setGlobalListStoreConfig: typeof setGlobalListStoreConfig_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    getDefaultGlobalListStoreConfig = provider.getDefaultGlobalListStoreConfig
    getGlobalListStoreConfig = provider.getGlobalListStoreConfig
    setGlobalListStoreConfig = provider.setGlobalListStoreConfig
  })

  it(`should return the default global store config if no other global store config were provided.`, () => {
    expect(getGlobalListStoreConfig()).toStrictEqual(getDefaultGlobalListStoreConfig())
  })

  it(`should always return a new instance of a global store config.`, () => {
    expect(getGlobalListStoreConfig()).not.toBe(getGlobalListStoreConfig())
  })

  it(`should allow to change the global config.`, () => {
    setGlobalListStoreConfig({
      storageDebounceTime: 1000,
    })
    expect(getGlobalListStoreConfig()).not.toStrictEqual(getDefaultGlobalListStoreConfig())
    expect(getGlobalListStoreConfig().storageDebounceTime).toBe(1000)
  })
})
