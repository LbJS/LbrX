import { ObjectCompareTypes, Storages, LbrXManager } from 'lbrx'
import { GlobalStoreConfigOptions, getGlobalStoreOptions as getGlobalStoreOptionsFunc } from 'lbrx/stores/config'

describe('LbrXManager setGlobalStoreConfig():', () => {

	let lbrxManager: typeof LbrXManager
	let getGlobalStoreOptions: () => GlobalStoreConfigOptions

	beforeEach(async () => {
		const provider = (await import('provider')).default
		lbrxManager = provider.provide(LbrXManager.name)
		getGlobalStoreOptions = provider.provide(getGlobalStoreOptionsFunc.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set global store configurations.', () => {
		lbrxManager.setGlobalStoreConfig({
			isResettable: false,
			isSimpleCloning: true,
			objectCompareType: ObjectCompareTypes.reference,
			storageDebounceTime: 500,
			storageType: Storages.local,
		})
		expect(getGlobalStoreOptions()).toMatchObject(<GlobalStoreConfigOptions>{
			isResettable: false,
			isSimpleCloning: true,
			objectCompareType: ObjectCompareTypes.reference,
			storageDebounceTime: 500,
			storageType: Storages.local,
			customStorage: null,
		})
	})

	it('should set global store configurations.', () => {
		lbrxManager.setGlobalStoreConfig({
			objectCompareType: ObjectCompareTypes.simple
		})
		expect(getGlobalStoreOptions()).toMatchObject(<GlobalStoreConfigOptions>{
			isResettable: true,
			isSimpleCloning: false,
			objectCompareType: ObjectCompareTypes.simple,
			storageDebounceTime: 2000,
			storageType: Storages.none,
			customStorage: null,
		})
	})

	it('should return LbrXManager.', () => {
		const value = lbrxManager.setGlobalStoreConfig({})
		expect(value).toStrictEqual(lbrxManager)
	})
})
