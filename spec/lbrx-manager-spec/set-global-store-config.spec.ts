import { ObjectCompareTypes, Storages, LbrXManager as LbrXManager_class } from 'lbrx'
import { GlobalStoreConfigOptions } from 'lbrx/stores/config'

describe('LbrXManager setGlobalStoreConfig():', () => {
	type LbrXManager_type = typeof LbrXManager_class
	type lbrxModule = typeof import('lbrx')
	type configModule = typeof import('lbrx/stores/config')

	let LbrXManager: LbrXManager_type
	let getGlobalStoreOptions: () => GlobalStoreConfigOptions

	beforeEach(async () => {
		const [lbrx, config]: [lbrxModule, configModule] = await Promise.all([import('lbrx'), import('lbrx/stores/config')])
		LbrXManager = lbrx.LbrXManager
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
