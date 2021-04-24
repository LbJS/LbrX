import { ObjectCompareTypes, Storages } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { getGlobalListStoreConfig as getGlobalListStoreConfig_type, GlobalListStoreConfigOptions } from 'lbrx/internal/stores/config'
import { Parse, Stringify } from 'lbrx/internal/stores/store-accessories'

describe(`LbrXManager - setGlobalListStoreConfig():`, () => {

  let LbrXManager: typeof LbrXManager_type
  let getGlobalListStoreConfig: typeof getGlobalListStoreConfig_type
  let stringify: Stringify
  let parse: Parse
  let defaultGlobalConfig: GlobalListStoreConfigOptions

  beforeEach(async () => {
    const provider = await import(`provider`)
    LbrXManager = provider.LbrXManager
    getGlobalListStoreConfig = provider.getGlobalListStoreConfig
    stringify = provider.stringify
    parse = provider.parse
    defaultGlobalConfig = {
      idKey: null,
      isResettable: false,
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
    const config: Partial<GlobalListStoreConfigOptions> = {
      objectCompareType: ObjectCompareTypes.simple
    }
    defaultGlobalConfig = Object.assign(defaultGlobalConfig, config)
    LbrXManager.setGlobalListStoreConfig(config)
    expect(getGlobalListStoreConfig()).toStrictEqual(defaultGlobalConfig)
  })

  it(`should return LbrXManager.`, () => {
    const value = LbrXManager.setGlobalListStoreConfig({})
    expect(value).toStrictEqual(LbrXManager)
  })
})
