import { GlobalStoreConfigOptions } from './global-store-config-options'
import { cloneObject } from 'lbrx/helpers'
import { Storages } from './storages.enum'
import { ObjectCompareTypes } from './object-compare-types.enum'
import { mergeStoreOptions } from './merge-store-options'

let globalStoreOptions: Required<GlobalStoreConfigOptions> = {
	isResettable: true,
	storageType: Storages.none,
	storageDebounceTime: 2000,
	storageKey: null,
	customStorage: null,
	objectCompareType: ObjectCompareTypes.advanced,
	isSimpleCloning: false,
}

export function setGlobalStoreConfig(options: GlobalStoreConfigOptions): void {
	globalStoreOptions = mergeStoreOptions(globalStoreOptions, options) as Required<GlobalStoreConfigOptions>
}

export function getGlobalStoreOptions(): GlobalStoreConfigOptions {
	return cloneObject(globalStoreOptions)
}
