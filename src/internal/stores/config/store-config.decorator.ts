import { cloneObject, isFunction, mergeObjects, throwError } from '../../helpers'
import { Class } from '../../types'
import { getGlobalStoreConfig } from './global-store-config'
import { STORE_CONFIG_KEY } from './store-config-key'
import { StoreConfigOptions } from './store-config-options.interface'

export function StoreConfig(options: StoreConfigOptions): <T extends Class>(constructor: T) => void {
  options = mergeObjects(getGlobalStoreConfig(), options) as StoreConfigOptions
  return <T extends Class>(constructor: T): void => {
    if (!isFunction(constructor)) throwError(`"@StoreConfig" decorator can decorate only a class!`)
    constructor[STORE_CONFIG_KEY] = cloneObject(options)
  }
}
