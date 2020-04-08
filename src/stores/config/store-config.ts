import { isFunction, logError, mergeObjects, objectKeys, throwError } from 'lbrx/helpers'
import { isDev } from 'lbrx/mode'
import { Class } from 'lbrx/types'
import { getGlobalStoreConfig } from './global-store-config'
import { STORE_CONFIG_KEY } from './store-config-key'
import { StoreConfigOptions } from './store-config-options'

export function StoreConfig(options: StoreConfigOptions): <T extends Class>(constructor: T) => void {
  options = mergeObjects(getGlobalStoreConfig(), options) as StoreConfigOptions
  options.storageKey = !!options.storageKey ? options.storageKey : options.name
  return <T extends Class>(constructor: T): void => {
    if (isFunction(constructor)) {
      constructor[STORE_CONFIG_KEY] = {}
      objectKeys(options).forEach(key => {
        constructor[STORE_CONFIG_KEY][key] = options[key]
      })
    } else {
      const errorMsg = '"@StoreConfig" decorator can decorate only a class!'
      isDev() ? throwError(errorMsg) : logError(errorMsg)
    }
  }
}
