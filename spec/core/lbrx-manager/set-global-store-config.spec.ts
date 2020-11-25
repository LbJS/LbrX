import { ObjectCompareTypes, Storages } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { getGlobalStoreConfig as getGlobalStoreConfig_type, GlobalStoreConfigOptions } from 'lbrx/internal/stores/config'
import { Parse, Stringify } from 'lbrx/internal/stores/store-accessories'

describe(`LbrXManager setGlobalStoreConfig():`, () => {

  let LbrXManager: typeof LbrXManager_type
  let getGlobalStoreConfig: typeof getGlobalStoreConfig_type
  let stringify: Stringify
  let parse: Parse
  let defaultGlobalConfig: GlobalStoreConfigOptions

  beforeEach(async () => {
    const provider = await import(`provider`)
    LbrXManager = provider.LbrXManager
    getGlobalStoreConfig = provider.getGlobalStoreConfig
    stringify = provider.stringify
    parse = provider.parse
    defaultGlobalConfig = {
      isResettable: true,
      isSimpleCloning: false,
      isClassHandler: true,
      objectCompareType: ObjectCompareTypes.advanced,
      storageDebounceTime: 2000,
      storageType: Storages.none,
      customStorageApi: null,
      isImmutable: true,
      stringify,
      parse,
      advanced: null,
    }
  })

  it(`should set global store configurations.`, () => {
    const config: Partial<GlobalStoreConfigOptions> = {
      objectCompareType: ObjectCompareTypes.simple
    }
    defaultGlobalConfig = Object.assign(defaultGlobalConfig, config)
    LbrXManager.setGlobalStoreConfig(config)
    expect(getGlobalStoreConfig()).toStrictEqual(defaultGlobalConfig)
  })

  it(`should return LbrXManager.`, () => {
    const value = LbrXManager.setGlobalStoreConfig({})
    expect(value).toStrictEqual(LbrXManager)
  })
})
