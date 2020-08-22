import { cloneObject, mergeObjects } from '../../helpers'
import { getDefaultGlobalStoreConfig } from './default-global-store-config'
import { GlobalStoreConfigOptions } from './global-store-config-options.interface'

let globalStoreOptions: GlobalStoreConfigOptions | null = null

export function setGlobalStoreConfig(options: GlobalStoreConfigOptions): void {
  globalStoreOptions = mergeObjects(getDefaultGlobalStoreConfig(), options)
}

export function getGlobalStoreConfig(): GlobalStoreConfigOptions {
  return globalStoreOptions ? cloneObject(globalStoreOptions) : getDefaultGlobalStoreConfig()
}
