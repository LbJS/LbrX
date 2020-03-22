import { StoreConfigOptions } from './store-config-options'
import { STORE_CONFIG_KEY } from './store-config-key'
import { isFunction, objectKeys, logError, Class, mergeObjects } from 'lbrx/helpers'
import { isDev } from 'lbrx/mode'
import { throwError } from 'rxjs'
import { getGlobalStoreOptions } from './global-store-config'

export function StoreConfig(options: StoreConfigOptions): <T extends Class>(constructor: T) => void {
	options = mergeObjects(getGlobalStoreOptions(), options) as StoreConfigOptions
	options.storageKey = !!options.storageKey ? options.storageKey : options.name
	return <T extends Class>(constructor: T): void => {
		if (isFunction(constructor)) {
			constructor[STORE_CONFIG_KEY] = {}
			objectKeys(options).forEach(key => {
				constructor[STORE_CONFIG_KEY][key] = options[key]
			})
		} else {
			const errorMsg = '"@StoreConfig" decorator can decorate only a class!'
			isDev ? throwError(errorMsg) : logError(errorMsg)
		}
	}
}
