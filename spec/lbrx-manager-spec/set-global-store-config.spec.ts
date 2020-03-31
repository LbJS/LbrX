import { ObjectCompareTypes, Storages, LbrXManager as LbrXManager_type } from 'lbrx'
import { GlobalStoreConfigOptions, getGlobalStoreConfig as getGlobalStoreConfigFunc } from 'lbrx/stores/config'
import { parse as parseFunc, stringify as stringifyFunc } from 'lbrx/helpers'

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
		const provider = (await import('provider')).default
		LbrXManager = provider.provide(LbrXManager_type.name)
		getGlobalStoreConfig = provider.provide(getGlobalStoreConfigFunc.name)
		stringify = provider.provide(stringifyFunc.name)
		parse = provider.provide(parseFunc.name)
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
