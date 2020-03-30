import { StoreConfig, StoreConfigOptionsInfo, Storages, ObjectCompareTypes, LbrXManager as LbrXManager_type, Store as Store_type } from 'lbrx'
import { isDev as isDevFunc } from 'lbrx/mode'
import MockBuilder from 'mock-builder'

describe('Store Config:', () => {

	let LbrXManager: typeof LbrXManager_type
	let Store: typeof Store_type
	let isDev: () => boolean

	beforeEach(async () => {
		const provider = (await import('provider')).default
		LbrXManager = provider.provide(LbrXManager_type.name)
		Store = provider.provide(Store_type.name)
		isDev = provider.provide(isDevFunc.name)
		jest.spyOn(globalThis.console, 'error').mockImplementation(() => jest.fn())
		MockBuilder.mockLocalStorage()
			.build()
	})

	afterEach(() => {
		jest.resetModules()
		MockBuilder.deleteAllMocks()
		jest.clearAllMocks()
	})

	it('should have the right default configuration', () => {
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
			customStorage: null,
			objectCompareType: ObjectCompareTypes.advanced,
			isSimpleCloning: false,
			storageKey: 'TEST-STORE',
			objectCompareTypeName: 'Advanced',
			storageTypeName: 'None',
		}
		expect(testStore.config).toMatchObject(expectedConfig)
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

	it('should not throw with two stores with the same name in production mode.', () => {
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

	it('should not throw with two stores with the same storage key in development mode.', () => {
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
	})
})
