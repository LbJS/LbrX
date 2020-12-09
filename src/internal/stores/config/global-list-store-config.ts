import { cloneObject, mergeObjects } from '../../helpers'
import { getDefaultGlobalListStoreConfig } from './default-global-list-store-config'
import { GlobalListStoreConfigOptions } from './global-list-store-config-options.interface'

let globalListStoreOptions: GlobalListStoreConfigOptions | null = null

export function setGlobalListStoreConfig(options: GlobalListStoreConfigOptions): void {
  globalListStoreOptions = mergeObjects(getDefaultGlobalListStoreConfig(), options)
}

export function getGlobalListStoreConfig(): GlobalListStoreConfigOptions {
  return globalListStoreOptions ? cloneObject(globalListStoreOptions) : getDefaultGlobalListStoreConfig()
}
