import { Actions, AdvancedConfigOptions, ObjectCompareTypes, Storages, Store as Store_type, StoreConfigCompleteInfo, StoreTags } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { isDev as isDev_type } from 'lbrx/internal/core'
import { DevToolsAdapter as DevToolsAdapter_type } from 'lbrx/internal/dev-tools'
import { QueryContextList as QueryContextList_type } from 'lbrx/internal/stores/store-accessories'
import { parse as parse_type, stringify as stringify_type } from 'lbrx/utils'
import { StoresFactory as StoresFactory_type } from '__test__/factories'
import MockBuilder from '__test__/mock-builder'
import { GenericStorage } from '__test__/mocks'
import { TestSubject } from '__test__/test-subjects'

describe(`Base Store - constructor():`, () => {

  // tslint:disable-next-line: quotemark
  let provider: typeof import('provider')
  let LbrXManager: typeof LbrXManager_type
  let StoresFactory: typeof StoresFactory_type
  let DevToolsAdapter: typeof DevToolsAdapter_type
  let QueryContextList: typeof QueryContextList_type
  let Store: typeof Store_type
  let isDev: typeof isDev_type
  let stringify: typeof stringify_type
  let parse: typeof parse_type

  beforeEach(async () => {
    provider = await import(`provider`)
    LbrXManager = provider.LbrXManager
    StoresFactory = provider.StoresFactory
    DevToolsAdapter = provider.DevToolsAdapter
    QueryContextList = provider.QueryContextList
    Store = provider.Store
    isDev = provider.isDev
    stringify = provider.stringify
    parse = provider.parse
    MockBuilder.addWindowMock()
      .addLocalStorageMock()
      .addSessionStorageMock()
      .buildMocks()
  })

  it(`should have the expected default configuration.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE` })
    const expectedConfig: Required<StoreConfigCompleteInfo> = {
      name: `TEST-STORE`,
      isResettable: true,
      storageType: Storages.none,
      storageDebounceTime: 2000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      isInstanceHandler: true,
      objectCompareTypeName: `Advanced`,
      storageKey: `TEST-STORE`,
      storageTypeName: `None`,
      isImmutable: true,
      stringify,
      parse,
      advanced: null,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(store[`_storeName`]).toBe(expectedConfig.name)
    expect(store[`_isResettable`]).toBe(expectedConfig.isResettable)
    expect(store[`_isSimpleCloning`]).toBe(expectedConfig.isSimpleCloning)
    expect(store[`_isInstanceHandler`]).toBe(expectedConfig.isInstanceHandler)
    expect(store[`_objectCompareType`]).toBe(expectedConfig.objectCompareType)
    expect(store[`_storageKey`]).toBe(expectedConfig.storageKey)
    expect(store[`_storageDebounce`]).toBe(expectedConfig.storageDebounceTime)
    expect(store[`_storage`]).toBeNull()
    expect(store[`_stringify`]).toBe(stringify)
    expect(store[`_parse`]).toBe(parse)
    expect(store[`_clone`]).toBe(provider.cloneObject)
    expect(store[`_freeze`]).toBe(provider.deepFreeze)
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(provider.compareObjects)
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should have the expected default configuration when passed via constructor.`, () => {
    class TestSubjectStore extends Store<TestSubject> {
      constructor() {
        super(null, { name: `TEST-STORE` })
      }
    }
    const store = new TestSubjectStore()
    const expectedConfig: Required<StoreConfigCompleteInfo> = {
      name: `TEST-STORE`,
      isResettable: true,
      storageType: Storages.none,
      storageDebounceTime: 2000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      isInstanceHandler: true,
      objectCompareTypeName: `Advanced`,
      storageKey: `TEST-STORE`,
      storageTypeName: `None`,
      isImmutable: true,
      stringify,
      parse,
      advanced: null,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(store[`_storeName`]).toBe(expectedConfig.name)
    expect(store[`_isResettable`]).toBe(expectedConfig.isResettable)
    expect(store[`_isSimpleCloning`]).toBe(expectedConfig.isSimpleCloning)
    expect(store[`_isInstanceHandler`]).toBe(expectedConfig.isInstanceHandler)
    expect(store[`_objectCompareType`]).toBe(expectedConfig.objectCompareType)
    expect(store[`_storageKey`]).toBe(expectedConfig.storageKey)
    expect(store[`_storageDebounce`]).toBe(expectedConfig.storageDebounceTime)
    expect(store[`_storage`]).toBeNull()
    expect(store[`_stringify`]).toBe(stringify)
    expect(store[`_parse`]).toBe(parse)
    expect(store[`_clone`]).toBe(provider.cloneObject)
    expect(store[`_freeze`]).toBe(provider.deepFreeze)
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(provider.compareObjects)
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should throw an error if no store config.`, () => {
    expect(() => {
      StoresFactory.createStoreWithNoConfig(null)
    }).toThrow()
  })

  it(`should throw an error if there are two stores with the same name.`, () => {
    expect(() => {
      StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE` })
      StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE` })
    }).toThrow()
  })

  it(`should throw an error if there are two stores with the same storage key.`, () => {
    expect(() => {
      StoresFactory.createStore<TestSubject>(null, {
        name: `TEST-STORE1`,
        storageType: Storages.local,
        storageKey: `TEST-KEY`,
      })
      StoresFactory.createStore<TestSubject>(null, {
        name: `TEST-STORE2`,
        storageType: Storages.local,
        storageKey: `TEST-KEY`,
      })
    }).toThrow()
  })

  it(`should throw is the state's value is provided with undefined.`, () => {
    expect(() => {
      StoresFactory.createStore<TestSubject>(undefined!, { name: `TEST-STORE` })
    }).toThrow()
  })

  it(`should have the right configuration base on chosen options. (1st option configuration)`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, {
      name: `TEST-STORE`,
      isResettable: false,
      storageType: Storages.local,
      storageDebounceTime: 5000,
      objectCompareType: ObjectCompareTypes.reference,
      isSimpleCloning: true,
      storageKey: `TEST-STORE-KEY`,
    })
    const expectedConfig: Required<StoreConfigCompleteInfo> = {
      name: `TEST-STORE`,
      isResettable: false,
      storageType: Storages.local,
      storageDebounceTime: 5000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.reference,
      isSimpleCloning: true,
      isInstanceHandler: true,
      storageKey: `TEST-STORE-KEY`,
      objectCompareTypeName: `Reference`,
      storageTypeName: `Local-Storage`,
      isImmutable: true,
      stringify,
      parse,
      advanced: null,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(store[`_storeName`]).toBe(expectedConfig.name)
    expect(store[`_isResettable`]).toBe(expectedConfig.isResettable)
    expect(store[`_isSimpleCloning`]).toBe(expectedConfig.isSimpleCloning)
    expect(store[`_isInstanceHandler`]).toBe(expectedConfig.isInstanceHandler)
    expect(store[`_objectCompareType`]).toBe(expectedConfig.objectCompareType)
    expect(store[`_storageKey`]).toBe(expectedConfig.storageKey)
    expect(store[`_storageDebounce`]).toBe(expectedConfig.storageDebounceTime)
    expect(store[`_storage`]).toBe(window.localStorage)
    expect(store[`_stringify`]).toBe(stringify)
    expect(store[`_parse`]).toBe(parse)
    expect(store[`_clone`]).toBe(provider.shallowCloneObject)
    expect(store[`_freeze`]).toBe(provider.deepFreeze)
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(store[`_refCompare`])
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should have the right configuration base on chosen options. (2nd option configuration)`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, {
      name: `TEST-STORE`,
      isResettable: false,
      storageType: Storages.session,
      storageDebounceTime: 5000,
      objectCompareType: ObjectCompareTypes.simple,
      isSimpleCloning: true,
      storageKey: `TEST-STORE-KEY`,
    })
    const expectedConfig: Required<StoreConfigCompleteInfo> = {
      name: `TEST-STORE`,
      isResettable: false,
      storageType: Storages.session,
      storageDebounceTime: 5000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.simple,
      isSimpleCloning: true,
      isInstanceHandler: true,
      storageKey: `TEST-STORE-KEY`,
      objectCompareTypeName: `Simple`,
      storageTypeName: `Session-Storage`,
      isImmutable: true,
      stringify,
      parse,
      advanced: null,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(store[`_storeName`]).toBe(expectedConfig.name)
    expect(store[`_isResettable`]).toBe(expectedConfig.isResettable)
    expect(store[`_isSimpleCloning`]).toBe(expectedConfig.isSimpleCloning)
    expect(store[`_isInstanceHandler`]).toBe(expectedConfig.isInstanceHandler)
    expect(store[`_objectCompareType`]).toBe(expectedConfig.objectCompareType)
    expect(store[`_storageKey`]).toBe(expectedConfig.storageKey)
    expect(store[`_storageDebounce`]).toBe(expectedConfig.storageDebounceTime)
    expect(store[`_storage`]).toBe(window.sessionStorage)
    expect(store[`_stringify`]).toBe(stringify)
    expect(store[`_parse`]).toBe(parse)
    expect(store[`_clone`]).toBe(provider.shallowCloneObject)
    expect(store[`_freeze`]).toBe(provider.deepFreeze)
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(provider.shallowCompareObjects)
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should have custom storage configured if api is supplied.`, () => {
    const genericStorage = new GenericStorage()
    const store = StoresFactory.createStore<TestSubject>(null, {
      name: `TEST-STORE`,
      storageType: Storages.custom,
      customStorageApi: genericStorage,
    })
    const expectedConfig: Required<StoreConfigCompleteInfo> = {
      name: `TEST-STORE`,
      isResettable: true,
      storageType: Storages.custom,
      storageDebounceTime: 2000,
      customStorageApi: genericStorage,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      isInstanceHandler: true,
      objectCompareTypeName: `Advanced`,
      storageKey: `TEST-STORE`,
      storageTypeName: `Custom`,
      isImmutable: true,
      stringify,
      parse,
      advanced: null,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(store[`_storeName`]).toBe(expectedConfig.name)
    expect(store[`_isResettable`]).toBe(expectedConfig.isResettable)
    expect(store[`_isSimpleCloning`]).toBe(expectedConfig.isSimpleCloning)
    expect(store[`_isInstanceHandler`]).toBe(expectedConfig.isInstanceHandler)
    expect(store[`_objectCompareType`]).toBe(expectedConfig.objectCompareType)
    expect(store[`_storageKey`]).toBe(expectedConfig.storageKey)
    expect(store[`_storageDebounce`]).toBe(expectedConfig.storageDebounceTime)
    expect(store[`_storage`]).toBe(genericStorage)
    expect(store[`_stringify`]).toBe(stringify)
    expect(store[`_parse`]).toBe(parse)
    expect(store[`_clone`]).toBe(provider.cloneObject)
    expect(store[`_freeze`]).toBe(provider.deepFreeze)
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(provider.compareObjects)
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should have custom storage set to null is storage type is not set to custom. Should also set a console warning.`, () => {
    const consoleWarnSpy = jest.spyOn(globalThis.console, `warn`).mockImplementation(() => jest.fn())
    const store = StoresFactory.createStore<TestSubject>(null, {
      name: `TEST-STORE`,
      storageType: Storages.local,
      customStorageApi: new GenericStorage(),
    })
    const expectedConfig: Required<StoreConfigCompleteInfo> = {
      name: `TEST-STORE`,
      isResettable: true,
      storageType: Storages.local,
      storageDebounceTime: 2000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      isInstanceHandler: true,
      objectCompareTypeName: `Advanced`,
      storageKey: `TEST-STORE`,
      storageTypeName: `Local-Storage`,
      isImmutable: true,
      stringify,
      parse,
      advanced: null,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(store[`_storeName`]).toBe(expectedConfig.name)
    expect(store[`_isResettable`]).toBe(expectedConfig.isResettable)
    expect(store[`_isSimpleCloning`]).toBe(expectedConfig.isSimpleCloning)
    expect(store[`_isInstanceHandler`]).toBe(expectedConfig.isInstanceHandler)
    expect(store[`_objectCompareType`]).toBe(expectedConfig.objectCompareType)
    expect(store[`_storageKey`]).toBe(expectedConfig.storageKey)
    expect(store[`_storageDebounce`]).toBe(expectedConfig.storageDebounceTime)
    expect(consoleWarnSpy).toBeCalledTimes(1)
    expect(store[`_storage`]).toBe(window.localStorage)
    expect(store[`_stringify`]).toBe(stringify)
    expect(store[`_parse`]).toBe(parse)
    expect(store[`_clone`]).toBe(provider.cloneObject)
    expect(store[`_freeze`]).toBe(provider.deepFreeze)
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(provider.compareObjects)
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should have storage type set to none is custom storage api is not set. Should also set a console warning.`, () => {
    const consoleWarnSpy = jest.spyOn(globalThis.console, `warn`).mockImplementation(() => jest.fn())
    const store = StoresFactory.createStore<TestSubject>(null, {
      name: `TEST-STORE`,
      storageType: Storages.custom,
      customStorageApi: null,
      isImmutable: false,
    })
    const expectedConfig: Required<StoreConfigCompleteInfo> = {
      name: `TEST-STORE`,
      isResettable: true,
      storageType: Storages.none,
      storageDebounceTime: 2000,
      customStorageApi: null,
      objectCompareType: ObjectCompareTypes.advanced,
      isSimpleCloning: false,
      isInstanceHandler: true,
      objectCompareTypeName: `Advanced`,
      storageKey: `TEST-STORE`,
      storageTypeName: `None`,
      isImmutable: false,
      stringify,
      parse,
      advanced: null,
    }
    expect(store.config).toStrictEqual(expectedConfig)
    expect(store[`_storeName`]).toBe(expectedConfig.name)
    expect(store[`_isResettable`]).toBe(expectedConfig.isResettable)
    expect(store[`_isSimpleCloning`]).toBe(expectedConfig.isSimpleCloning)
    expect(store[`_isInstanceHandler`]).toBe(expectedConfig.isInstanceHandler)
    expect(store[`_objectCompareType`]).toBe(expectedConfig.objectCompareType)
    expect(store[`_storageKey`]).toBe(expectedConfig.storageKey)
    expect(store[`_storageDebounce`]).toBe(expectedConfig.storageDebounceTime)
    expect(consoleWarnSpy).toBeCalledTimes(1)
    expect(store[`_storage`]).toBeNull()
    expect(store[`_stringify`]).toBe(stringify)
    expect(store[`_parse`]).toBe(parse)
    expect(store[`_clone`]).toBe(store[`_noClone`])
    expect(store[`_freeze`]).toBe(store[`_noFreeze`])
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(provider.compareObjects)
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should not include advanced configuration by default.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE` })
    expect(store.config.advanced).toBeNull()
    expect(store[`_clone`]).toBe(provider.cloneObject)
    expect(store[`_freeze`]).toBe(provider.deepFreeze)
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(provider.compareObjects)
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should include the provided advanced configurations.`, () => {
    const advanced: AdvancedConfigOptions = {
      clone: (a: any) => a,
      freeze: (a: any) => a,
      handleTypes: (a: any, b: any) => a,
      compare: (a: any, b: any) => a === b,
      cloneError: (e: any) => e,
      merge: (a: any, b: any) => a
    }
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE`, advanced })
    expect(store[`_clone`]).toBe(advanced.clone)
    expect(store[`_freeze`]).toBe(advanced.freeze)
    expect(store[`_handleTypes`]).toBe(advanced.handleTypes)
    expect(store[`_compare`]).toBe(advanced.compare)
    expect(store[`_cloneError`]).toBe(advanced.cloneError)
    expect(store[`_merge`]).toBe(advanced.merge)
  })

  it(`should include the provided advanced configurations and ignore the undefined ones.`, () => {
    const advanced: AdvancedConfigOptions = {
      clone: (a: any) => a,
      freeze: (a: any) => a,
      handleTypes: (a: any, b: any) => a,
    }
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE`, advanced })
    expect(store[`_clone`]).toBe(advanced.clone)
    expect(store[`_freeze`]).toBe(advanced.freeze)
    expect(store[`_handleTypes`]).toBe(advanced.handleTypes)
    expect(store[`_compare`]).toBe(provider.compareObjects)
    expect(store[`_cloneError`]).toBe(provider.cloneError)
    expect(store[`_merge`]).toBe(provider.mergeObjects)
  })

  it(`should include the provided advanced configurations and ignore the null ones.`, () => {
    const advanced: AdvancedConfigOptions = {
      clone: null,
      freeze: null,
      handleTypes: null,
      compare: (a: any, b: any) => a === b,
      cloneError: (e: any) => e,
      merge: (a: any, b: any) => a
    }
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE`, advanced })
    expect(store[`_clone`]).toBe(provider.cloneObject)
    expect(store[`_freeze`]).toBe(provider.deepFreeze)
    expect(store[`_handleTypes`]).toBe(provider.handleObjectTypes)
    expect(store[`_compare`]).toBe(advanced.compare)
    expect(store[`_cloneError`]).toBe(advanced.cloneError)
    expect(store[`_merge`]).toBe(advanced.merge)
  })

  it(`should set the store to DevToolsAdapter stores object.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE` })
    expect(DevToolsAdapter.stores[store.config.name]).toBe(store)
  })

  it(`should set the store's state to DevToolsAdapter states object.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE` })
    expect(DevToolsAdapter.states[store.config.name]).toStrictEqual(store.state)
  })

  it(`should set the store's state value to DevToolsAdapter values object.`, () => {
    const store = StoresFactory.createStore({ foo: `Foo` }, { name: `TEST-STORE` })
    expect(DevToolsAdapter.values[store.config.name]).toStrictEqual(store.value)
  })

  it(`should initialize the store if value is provided.`, () => {
    const store = StoresFactory.createStore({ foo: `Foo` }, { name: `TEST-STORE` })
    expect(store.storeTag).toBe(StoreTags.active)
    expect(store[`_lastAction`]).toBe(Actions.init)
    expect(store.isInitialized).toBeTruthy()
  })

  it(`should set the store into loading state if null is provided as a value.`, () => {
    const store = StoresFactory.createStore(null, { name: `TEST-STORE` })
    expect(store.storeTag).toBe(StoreTags.loading)
    expect(store[`_lastAction`]).toBe(Actions.loading)
    expect(store.state.isLoading).toBeTruthy()
  })

  it(`should have _queryContextList prop with an instance of QueryContextList.`, () => {
    const store = StoresFactory.createStore(null, { name: `TEST-STORE` })
    expect(store[`_queryContextList`]).toBeInstanceOf(QueryContextList)
  })
})
