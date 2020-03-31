import { GlobalStoreConfigOptions } from './global-store-config-options'
import { cloneObject, mergeObjects } from 'lbrx/helpers'
import { getDefaultStoreOptions } from './default-global-store-config'

let globalStoreOptions: GlobalStoreConfigOptions = getDefaultStoreOptions()

export function setGlobalStoreConfig(options: GlobalStoreConfigOptions): void {
	globalStoreOptions = mergeObjects(globalStoreOptions, options)
}

export function getGlobalStoreConfig(): GlobalStoreConfigOptions {
	return cloneObject(globalStoreOptions)
}
