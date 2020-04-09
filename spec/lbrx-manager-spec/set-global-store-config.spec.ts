import { LbrXManager as LbrXManager_type, ObjectCompareTypes, Storages } from 'lbrx'
import { GlobalStoreConfigOptions } from 'lbrx/stores/config'

describe('LbrXManager setGlobalStoreConfig():', () => {

  let LbrXManager: typeof LbrXManager_type
  let getGlobalStoreConfig: () => GlobalStoreConfigOptions
  let stringify: (
    value: any,
    replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
    space?: string | number
  ) => string
  let parse: (text: string | null, reviver?: (this: any, key: string, value: any) => any) => any

  beforeEach(async () => {
    const providerModule = await import('provider.module')
    LbrXManager = providerModule.LbrXManager
    getGlobalStoreConfig = providerModule.getGlobalStoreConfig
    stringify = providerModule.stringify
    parse = providerModule.parse
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should set global store configurations.', () => {
    const config: Partial<GlobalStoreConfigOptions> = {
      isResettable: false,
      isSimpleCloning: true,
      objectCompareType: ObjectCompareTypes.reference,
      storageDebounceTime: 500,
      storageType: Storages.local,
    }
    const expectedValue: GlobalStoreConfigOptions = {
      isResettable: false,
      isSimpleCloning: true,
      objectCompareType: ObjectCompareTypes.reference,
      storageDebounceTime: 500,
      storageType: Storages.local,
      customStorageApi: null,
      stringify,
      parse,
    }
    LbrXManager.setGlobalStoreConfig(config)
    expect(getGlobalStoreConfig()).toStrictEqual(expectedValue)
  })

  it('should set global store configurations.', () => {
    const config: Partial<GlobalStoreConfigOptions> = {
      objectCompareType: ObjectCompareTypes.simple
    }
    const expectedValue: GlobalStoreConfigOptions = {
      isResettable: true,
      isSimpleCloning: false,
      objectCompareType: ObjectCompareTypes.simple,
      storageDebounceTime: 2000,
      storageType: Storages.none,
      customStorageApi: null,
      stringify,
      parse,
    }
    LbrXManager.setGlobalStoreConfig(config)
    expect(getGlobalStoreConfig()).toStrictEqual(expectedValue)
  })

  it('should return LbrXManager.', () => {
    const value = LbrXManager.setGlobalStoreConfig({})
    expect(value).toStrictEqual(LbrXManager)
  })
})
