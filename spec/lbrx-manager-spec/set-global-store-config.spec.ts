import { ObjectCompareTypes, Storages, LbrXManager as LbrXManager_type } from 'lbrx'
import { GlobalStoreConfigOptions, getGlobalStoreConfig as getGlobalStoreConfigFunc } from 'lbrx/stores/config'

describe('LbrXManager setGlobalStoreConfig():', () => {

	let LbrXManager: typeof LbrXManager_type
	let getGlobalStoreConfig: () => GlobalStoreConfigOptions

	beforeEach(async () => {
		const provider = (await import('provider')).default
		LbrXManager = provider.provide(LbrXManager_type.name)
		getGlobalStoreConfig = provider.provide(getGlobalStoreConfigFunc.name)
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
		expect(getGlobalStoreConfig()).toMatchObject(<GlobalStoreConfigOptions>{
			isResettable: false,
			isSimpleCloning: true,
			objectCompareType: ObjectCompareTypes.reference,
			storageDebounceTime: 500,
			storageType: Storages.local,
			customStorageApi: null,
		})
	})

	it('should set global store configurations.', () => {
		LbrXManager.setGlobalStoreConfig({
			objectCompareType: ObjectCompareTypes.simple
		})
		expect(getGlobalStoreConfig()).toMatchObject(<GlobalStoreConfigOptions>{
			isResettable: true,
			isSimpleCloning: false,
			objectCompareType: ObjectCompareTypes.simple,
			storageDebounceTime: 2000,
			storageType: Storages.none,
			customStorageApi: null,
		})
	})

	it('should return LbrXManager.', () => {
		const value = LbrXManager.setGlobalStoreConfig({})
		expect(value).toStrictEqual(LbrXManager)
	})
})
