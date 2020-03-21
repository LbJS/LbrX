import { StoreConfigOptions } from './store-config-options'

export interface StoreConfigOptionsInfo extends Required<StoreConfigOptions> {
	storageTypeName: string,
	objectCompareTypeName: string,
}
