import { ObjectCompareTypes, Storages, LbrXManager as LbrXManager_type } from 'lbrx'
import { GlobalStoreConfigOptions, getGlobalStoreOptions as getGlobalStoreOptionsFunc } from 'lbrx/stores/config'

describe('LbrXManager setGlobalStoreConfig():', () => {

	let LbrXManager: typeof LbrXManager_type
	let getGlobalStoreOptions: () => GlobalStoreConfigOptions

	beforeEach(async () => {
		const provider = (await import('provider')).default
		LbrXManager = provider.provide(LbrXManager_type.name)
		getGlobalStoreOptions = provider.provide(getGlobalStoreOptionsFunc.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set global store configurations.', () => {
		LbrXManager.setGlobalStoreConfig({
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
		LbrXManager.setGlobalStoreConfig({
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
		const value = LbrXManager.setGlobalStoreConfig({})
		expect(value).toStrictEqual(LbrXManager)
	})
})
