import { ObjectCompareTypes, Storages, LbrXManager as LbrXManager_type } from 'lbrx'
import { GlobalStoreConfigOptions } from 'lbrx/stores/config'

describe('LbrXManager setGlobalStoreConfig():', () => {

	let LbrXManager: typeof LbrXManager_type
	let getGlobalStoreOptions: () => GlobalStoreConfigOptions

	beforeEach(async () => {
		const lbrx = await import('lbrx')
		LbrXManager = lbrx.LbrXManager
		const config = await import('lbrx/stores/config')
		getGlobalStoreOptions = config.getGlobalStoreOptions
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

	it('should should return LbrXManager.', () => {
		const value = LbrXManager.setGlobalStoreConfig({})
		expect(value).toStrictEqual(LbrXManager)
	})
})
