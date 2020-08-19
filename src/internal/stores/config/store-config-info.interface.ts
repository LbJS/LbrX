import { StoreConfigOptions } from './store-config-options.interface'

export interface StoreConfigInfo extends Required<StoreConfigOptions> {
  storageTypeName: string,
  objectCompareTypeName: string,
}
