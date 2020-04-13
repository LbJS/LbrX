import { StoresFactory as StoresFactory_type } from 'factories'
import { LbrXManager as LbrXManager_type, ObjectCompareTypes, Storages, Store, StoreConfigOptions, StoreConfigOptionsInfo } from 'lbrx'
import { parse as parseFunc, stringify as stringifyFunc } from 'lbrx/helpers'
import MockBuilder from 'mock-builder'
import { GenericStorage } from 'mocks'
import { TestSubject } from 'test-subjects'

describe('Store Config:', () => {

  let LbrXManager: typeof LbrXManager_type
  let StoresFactory: typeof StoresFactory_type
  let store: Store<TestSubject>
  let isDev: () => boolean
  let stringify: typeof stringifyFunc
  let parse: typeof parseFunc
  const createStore = (options: StoreConfigOptions) => StoresFactory.createStore<TestSubject>(null, options)

  beforeEach(async () => {
    const providerModule = await import('provider.module')
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
    const expectedConfig: Required<StoreConfigOptionsInfo> = {
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

  it('should throw an error if there are two stores with the same name in development mode.', () => {
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

  it('should not throw an error if there are two stores with the same name in production mode, but should console error instead.', () => {
    const consoleErrorSpy = jest.spyOn(globalThis.console, 'error').mockImplementation(() => jest.fn())
    LbrXManager.enableProdMode()
    expect(isDev()).toBeFalsy()
    expect(() => {
      createStore({
        name: 'TEST-STORE'
      })
      createStore({
        name: 'TEST-STORE'
      })
    }).not.toThrow()
    expect(consoleErrorSpy).toBeCalled()
  })

  it('should throw an error if there are two stores with the same storage key in development mode.', () => {
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

  // tslint:disable-next-line: max-line-length
  it('should not throw an error if there are two stores with the same storage key in development mode, but should console error instead.', () => {
    const consoleErrorSpy = jest.spyOn(globalThis.console, 'error').mockImplementation(() => jest.fn())
    LbrXManager.enableProdMode()
    expect(isDev()).toBeFalsy()
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
    }).not.toThrow()
    expect(consoleErrorSpy).toBeCalled()
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
    const expectedConfig: Required<StoreConfigOptionsInfo> = {
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
    const expectedConfig: Required<StoreConfigOptionsInfo> = {
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
    const expectedConfig: Required<StoreConfigOptionsInfo> = {
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
    const expectedConfig: Required<StoreConfigOptionsInfo> = {
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
    const expectedConfig: Required<StoreConfigOptionsInfo> = {
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
      stringify,
      parse,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(consoleWarnSpy).toBeCalled()
  })
})
