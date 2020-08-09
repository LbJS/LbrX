import { cloneObject, mergeObjects } from '../../utils'
import { getDefaultStoreConfig } from './default-global-store-config'
import { GlobalStoreConfigOptions } from './global-store-config-options.interface'

let globalStoreOptions: GlobalStoreConfigOptions | null = null

export function setGlobalStoreConfig(options: GlobalStoreConfigOptions): void {
  globalStoreOptions = mergeObjects(getDefaultStoreConfig(), options)
}

export function getGlobalStoreConfig(): GlobalStoreConfigOptions {
  return globalStoreOptions ? cloneObject(globalStoreOptions) : getDefaultStoreConfig()
}
