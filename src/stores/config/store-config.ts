import { StoreConfigOptions } from './store-config-options'
import { STORE_CONFIG_KEY } from './store-config-key'
import { isFunction, objectKeys, logError, Constructable } from 'lbrx/helpers'
import { isDev } from 'lbrx/mode'
import { throwError } from 'rxjs'

export function StoreConfig(options: StoreConfigOptions):
	<T extends Constructable<T>>(constructor: T) => void {
	return <T extends Constructable<T>>(constructor: T): void => {
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
