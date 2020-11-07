import { StoreConfigOptions } from './store-config-options.interface'

export interface StoreConfigCompleteInfo extends Required<StoreConfigOptions> {
  storageTypeName: string,
  objectCompareTypeName: string,
}
