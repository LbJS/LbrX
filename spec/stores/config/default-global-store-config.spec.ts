import { ObjectCompareTypes, Storages } from 'lbrx'
import { getDefaultGlobalStoreConfig } from 'lbrx/internal/stores/config'
import { parse, stringify } from 'lbrx/utils'

describe(`Store Accessories - default global store config:`, () => {

  it(`should return the expected default global store config.`, () => {
    const expectedDefaultGlobalStoreConfig = {
      isResettable: true,
      storageType: Storages.none,
      storageDebounceTime: 2000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      isClassHandler: true,
      isImmutable: true,
      stringify,
      parse,
      advanced: null,
    }
    expect(getDefaultGlobalStoreConfig()).toStrictEqual(expectedDefaultGlobalStoreConfig)
  })

  it(`should always return a new instance of a default global store config.`, () => {
    expect(getDefaultGlobalStoreConfig()).not.toBe(getDefaultGlobalStoreConfig())
  })
})
