import { GlobalStoreConfigOptions } from './global-store-config-options'
import { Storages } from './storages.enum'
import { ObjectCompareTypes } from './object-compare-types.enum'

const defaultStoreOptions: Required<GlobalStoreConfigOptions> = {
	isResettable: true,
	storageType: Storages.none,
	storageDebounceTime: 2000,
	customStorageApi: null,
	objectCompareType: ObjectCompareTypes.advanced,
	isSimpleCloning: false,
}

export function getDefaultStoreOptions(): GlobalStoreConfigOptions {
	return defaultStoreOptions
}
