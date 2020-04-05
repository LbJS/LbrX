import { ObjectCompareTypes, Storages, LbrXManager as LbrXManager_type } from 'lbrx'
import { GlobalStoreConfigOptions } from 'lbrx/stores/config'

describe('LbrXManager setGlobalStoreConfig():', () => {

	let LbrXManager: typeof LbrXManager_type
	let getGlobalStoreConfig: () => GlobalStoreConfigOptions
	let stringify: (
		value: any,
		replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
		space?: string | number
	) => string
	let parse: (text: string | null, reviver?: (this: any, key: string, value: any) => any) => any

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		LbrXManager = providerModule.LbrXManager
		getGlobalStoreConfig = providerModule.getGlobalStoreConfig
		stringify = providerModule.stringify
		parse = providerModule.parse
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
		expect(getGlobalStoreConfig()).toStrictEqual(<GlobalStoreConfigOptions>{
			isResettable: false,
			isSimpleCloning: true,
			objectCompareType: ObjectCompareTypes.reference,
			storageDebounceTime: 500,
			storageType: Storages.local,
			customStorageApi: null,
			stringify,
			parse,
		})
	})

	it('should set global store configurations.', () => {
		LbrXManager.setGlobalStoreConfig({
			objectCompareType: ObjectCompareTypes.simple
		})
		expect(getGlobalStoreConfig()).toStrictEqual(<GlobalStoreConfigOptions>{
			isResettable: true,
			isSimpleCloning: false,
			objectCompareType: ObjectCompareTypes.simple,
			storageDebounceTime: 2000,
			storageType: Storages.none,
			customStorageApi: null,
			stringify,
			parse,
		})
	})

	it('should return LbrXManager.', () => {
		const value = LbrXManager.setGlobalStoreConfig({})
		expect(value).toStrictEqual(LbrXManager)
	})
})
