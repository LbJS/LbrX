import { ObjectCompareTypes, Storages } from 'lbrx'
import { getDefaultGlobalListStoreConfig } from 'lbrx/internal/stores/config'
import { parse, stringify } from 'lbrx/utils'

describe(`Store Accessories - default  global list store config:`, () => {

  it(`should return the expected default global list store config.`, () => {
    const expectedDefaultGlobalStoreConfig = {
      id: `id`,
      isResettable: false,
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
    expect(getDefaultGlobalListStoreConfig()).toStrictEqual(expectedDefaultGlobalStoreConfig)
  })

  it(`should always return a new instance of a default global store config.`, () => {
    expect(getDefaultGlobalListStoreConfig()).not.toBe(getDefaultGlobalListStoreConfig())
  })
})
