import { StoreConfig, StoreConfigOptionsInfo, Storages, ObjectCompareTypes, LbrXManager as LbrXManager_type, Store as Store_type } from 'lbrx'
import { isDev as isDevFunc } from 'lbrx/mode'
import MockBuilder from 'mock-builder'
import { GenericStorage } from 'mocks'
import { parse, stringify } from 'lbrx/helpers'

describe('Store Config:', () => { // TODO: no decorator test

	let LbrXManager: typeof LbrXManager_type
	let Store: typeof Store_type
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		LbrXManager = provider.provide(LbrXManager_type.name)
		Store = provider.provide(Store_type.name)
		isDev = provider.provide(isDevFunc.name)
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
		@StoreConfig({
			name: 'TEST-STORE'
		})
		class TestStore extends Store<any> { }
		const testStore = new TestStore(null)
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
		expect(testStore.config).toStrictEqual(expectedConfig)
	})

	it('should throw with no store config.', () => {
		expect(() => {
			class TestStore extends Store<any> { }
			const testStore = new TestStore(null)
		}).toThrow()
	})

	it('should throw with two stores with the same name in development mode.', () => {
		expect(isDev()).toBeTruthy()
		expect(() => {
			@StoreConfig({
				name: 'TEST-STORE'
			})
			class TestStoreA extends Store<any> { }
			const testStoreA = new TestStoreA(null)
			@StoreConfig({
				name: 'TEST-STORE'
			})
			class TestStoreB extends Store<any> { }
			const testStoreB = new TestStoreB(null)
		}).toThrow()
	})

	it('should not throw with two stores with the same name in production mode, but should console error instead.', () => {
		const consoleErrorSpy = jest.spyOn(globalThis.console, 'error').mockImplementation(() => jest.fn())
		LbrXManager.enableProdMode()
		expect(isDev()).toBeFalsy()
		expect(() => {
			@StoreConfig({
				name: 'TEST-STORE'
			})
			class TestStoreA extends Store<any> { }
			const testStoreA = new TestStoreA(null)
			@StoreConfig({
				name: 'TEST-STORE'
			})
			class TestStoreB extends Store<any> { }
			const testStoreB = new TestStoreB(null)
		}).not.toThrow()
		expect(consoleErrorSpy).toBeCalled()
	})

	it('should throw with two stores with the same storage key in development mode.', () => {
		expect(isDev()).toBeTruthy()
		expect(() => {
			@StoreConfig({
				name: 'TEST-STORE',
				storageType: Storages.local,
				storageKey: 'TEST-KEY',
			})
			class TestStoreA extends Store<any> { }
			const testStoreA = new TestStoreA(null)
			@StoreConfig({
				name: 'TEST-STORE',
				storageType: Storages.local,
				storageKey: 'TEST-KEY',
			})
			class TestStoreB extends Store<any> { }
			const testStoreB = new TestStoreB(null)
		}).toThrow()
	})

	it('should not throw with two stores with the same storage key in development mode, but should console error instead.', () => {
		const consoleErrorSpy = jest.spyOn(globalThis.console, 'error').mockImplementation(() => jest.fn())
		LbrXManager.enableProdMode()
		expect(isDev()).toBeFalsy()
		expect(() => {
			@StoreConfig({
				name: 'TEST-STORE',
				storageType: Storages.local,
				storageKey: 'TEST-KEY',
			})
			class TestStoreA extends Store<any> { }
			const testStoreA = new TestStoreA(null)
			@StoreConfig({
				name: 'TEST-STORE',
				storageType: Storages.local,
				storageKey: 'TEST-KEY',
			})
			class TestStoreB extends Store<any> { }
			const testStoreB = new TestStoreB(null)
		}).not.toThrow()
		expect(consoleErrorSpy).toBeCalled()
	})

	it('should have the right configuration base on chosen options. {testId: 1}', () => {
		@StoreConfig({
			name: 'TEST-STORE',
			isResettable: false,
			storageType: Storages.local,
			storageDebounceTime: 5000,
			objectCompareType: ObjectCompareTypes.reference,
			isSimpleCloning: true,
			storageKey: 'TEST-STORE-KEY',
		})
		class TestStore extends Store<any> { }
		const testStore = new TestStore(null)
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
		expect(testStore.config).toStrictEqual(expectedConfig)
	})

	it('should have the right configuration base on chosen options. {testId: 2}', () => {
		@StoreConfig({
			name: 'TEST-STORE',
			isResettable: false,
			storageType: Storages.session,
			storageDebounceTime: 5000,
			objectCompareType: ObjectCompareTypes.simple,
			isSimpleCloning: true,
			storageKey: 'TEST-STORE-KEY',
		})
		class TestStore extends Store<any> { }
		const testStore = new TestStore(null)
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
		expect(testStore.config).toStrictEqual(expectedConfig)
	})

	it('should have custom storage configured if api is supplied.', () => {
		@StoreConfig({
			name: 'TEST-STORE',
			storageType: Storages.custom,
			customStorageApi: new GenericStorage(),
		})
		class TestStore extends Store<any> { }
		const testStore = new TestStore(null)
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
		expect(testStore.config).toStrictEqual(expectedConfig)
	})

	it('should have custom storage set to null is storage type is not set to custom. Should also set a console warning.', () => {
		const consoleWarnSpy = jest.spyOn(globalThis.console, 'warn').mockImplementation(() => jest.fn())
		@StoreConfig({
			name: 'TEST-STORE',
			storageType: Storages.local,
			customStorageApi: new GenericStorage(),
		})
		class TestStore extends Store<any> { }
		const testStore = new TestStore(null)
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
		expect(testStore.config).toStrictEqual(expectedConfig)
		expect(consoleWarnSpy).toBeCalled()
	})

	it('should have storage type set to none is custom storage api is not set. Should also set a console warning.', () => {
		const consoleWarnSpy = jest.spyOn(globalThis.console, 'warn').mockImplementation(() => jest.fn())
		@StoreConfig({
			name: 'TEST-STORE',
			storageType: Storages.custom,
			customStorageApi: null,
		})
		class TestStore extends Store<any> { }
		const testStore = new TestStore(null)
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
		expect(testStore.config).toStrictEqual(expectedConfig)
		expect(consoleWarnSpy).toBeCalled()
	})
})
