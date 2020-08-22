import { StoresFactory as StoresFactory_type } from 'helpers/factories'
import MockBuilder from 'helpers/mock-builder'
import { GenericStorage } from 'helpers/mocks'
import { TestSubject } from 'helpers/test-subjects'
import { ObjectCompareTypes, Storages, Store, StoreConfigInfo, StoreConfigOptions } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { parse as parseFunc, stringify as stringifyFunc } from 'lbrx/utils'

describe('Store Config:', () => {

  let LbrXManager: typeof LbrXManager_type
  let StoresFactory: typeof StoresFactory_type
  let store: Store<TestSubject>
  let isDev: () => boolean
  let stringify: typeof stringifyFunc
  let parse: typeof parseFunc
  const createStore = (options: StoreConfigOptions) => StoresFactory.createStore<TestSubject>(null, options)

  beforeEach(async () => {
    const providerModule = await import('provider')
    LbrXManager = providerModule.LbrXManager
    StoresFactory = providerModule.StoresFactory
    isDev = providerModule.isDev
    stringify = providerModule.stringify
    parse = providerModule.parse
    MockBuilder.addLocalStorageMock()
      .addSessionStorageMock()
      .buildMocks()
  })

  afterEach(() => {
    jest.resetModules()
    MockBuilder.deleteAllMocks()
    jest.clearAllMocks()
  })

  it('should have the right default configuration.', () => {
    store = createStore({
      name: 'TEST-STORE'
    })
    const expectedConfig: Required<StoreConfigInfo> = {
      name: 'TEST-STORE',
      isResettable: true,
      storageType: Storages.none,
      storageDebounceTime: 2000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      storageKey: 'TEST-STORE',
      objectCompareTypeName: 'Advanced',
      storageTypeName: 'None',
      isImmutable: true,
      stringify,
      parse,
    }
    expect(store.config).toStrictEqual(expectedConfig)
  })

  it('should throw an error if no store config.', () => {
    expect(() => {
      StoresFactory.createStoreWithNoConfig(null)
    }).toThrow()
  })

  it('should throw an error if there are two stores with the same name.', () => {
    expect(isDev()).toBeTruthy()
    expect(() => {
      createStore({
        name: 'TEST-STORE'
      })
      createStore({
        name: 'TEST-STORE'
      })
    }).toThrow()
  })

  it('should throw an error if there are two stores with the same storage key.', () => {
    expect(isDev()).toBeTruthy()
    expect(() => {
      createStore({
        name: 'TEST-STORE1',
        storageType: Storages.local,
        storageKey: 'TEST-KEY',
      })
      createStore({
        name: 'TEST-STORE2',
        storageType: Storages.local,
        storageKey: 'TEST-KEY',
      })
    }).toThrow()
  })

  it('should have the right configuration base on chosen options. (1st option configuration)', () => {
    store = createStore({
      name: 'TEST-STORE',
      isResettable: false,
      storageType: Storages.local,
      storageDebounceTime: 5000,
      objectCompareType: ObjectCompareTypes.reference,
      isSimpleCloning: true,
      storageKey: 'TEST-STORE-KEY',
    })
    const expectedConfig: Required<StoreConfigInfo> = {
      name: 'TEST-STORE',
      isResettable: false,
      storageType: Storages.local,
      storageDebounceTime: 5000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.reference,
      isSimpleCloning: true,
      storageKey: 'TEST-STORE-KEY',
      objectCompareTypeName: 'Reference',
      storageTypeName: 'Local-Storage',
      isImmutable: true,
      stringify,
      parse,
    }
    expect(store.config).toStrictEqual(expectedConfig)
  })

  it('should have the right configuration base on chosen options. (2nd option configuration)', () => {
    store = createStore({
      name: 'TEST-STORE',
      isResettable: false,
      storageType: Storages.session,
      storageDebounceTime: 5000,
      objectCompareType: ObjectCompareTypes.simple,
      isSimpleCloning: true,
      storageKey: 'TEST-STORE-KEY',
    })
    const expectedConfig: Required<StoreConfigInfo> = {
      name: 'TEST-STORE',
      isResettable: false,
      storageType: Storages.session,
      storageDebounceTime: 5000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.simple,
      isSimpleCloning: true,
      storageKey: 'TEST-STORE-KEY',
      objectCompareTypeName: 'Simple',
      storageTypeName: 'Session-Storage',
      isImmutable: true,
      stringify,
      parse,
    }
    expect(store.config).toStrictEqual(expectedConfig)
  })

  it('should have custom storage configured if api is supplied.', () => {
    store = createStore({
      name: 'TEST-STORE',
      storageType: Storages.custom,
      customStorageApi: new GenericStorage(),
    })
    const expectedConfig: Required<StoreConfigInfo> = {
      name: 'TEST-STORE',
      isResettable: true,
      storageType: Storages.custom,
      storageDebounceTime: 2000,
      customStorageApi: new GenericStorage(),
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      storageKey: 'TEST-STORE',
      objectCompareTypeName: 'Advanced',
      storageTypeName: 'Custom',
      isImmutable: true,
      stringify,
      parse,
    }
    expect(store.config).toStrictEqual(expectedConfig)
  })

  it('should have custom storage set to null is storage type is not set to custom. Should also set a console warning.', () => {
    const consoleWarnSpy = jest.spyOn(globalThis.console, 'warn').mockImplementation(() => jest.fn())
    store = createStore({
      name: 'TEST-STORE',
      storageType: Storages.local,
      customStorageApi: new GenericStorage(),
    })
    const expectedConfig: Required<StoreConfigInfo> = {
      name: 'TEST-STORE',
      isResettable: true,
      storageType: Storages.local,
      storageDebounceTime: 2000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      storageKey: 'TEST-STORE',
      objectCompareTypeName: 'Advanced',
      storageTypeName: 'Local-Storage',
      isImmutable: true,
      stringify,
      parse,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(consoleWarnSpy).toBeCalled()
  })

  it('should have storage type set to none is custom storage api is not set. Should also set a console warning.', () => {
    const consoleWarnSpy = jest.spyOn(globalThis.console, 'warn').mockImplementation(() => jest.fn())
    store = createStore({
      name: 'TEST-STORE',
      storageType: Storages.custom,
      customStorageApi: null,
    })
    const expectedConfig: Required<StoreConfigInfo> = {
      name: 'TEST-STORE',
      isResettable: true,
      storageType: Storages.none,
      storageDebounceTime: 2000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      storageKey: 'TEST-STORE',
      objectCompareTypeName: 'Advanced',
      storageTypeName: 'None',
      isImmutable: true,
      stringify,
      parse,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(consoleWarnSpy).toBeCalled()
  })
})
