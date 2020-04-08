import { cloneObject, mergeObjects } from 'lbrx/helpers'
import { getDefaultStoreOptions } from './default-global-store-config'
import { GlobalStoreConfigOptions } from './global-store-config-options'

let globalStoreOptions: GlobalStoreConfigOptions = getDefaultStoreOptions()

export function setGlobalStoreConfig(options: GlobalStoreConfigOptions): void {
  globalStoreOptions = mergeObjects(globalStoreOptions, options)
}

export function getGlobalStoreConfig(): GlobalStoreConfigOptions {
  return cloneObject(globalStoreOptions)
}
