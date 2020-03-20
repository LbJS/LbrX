import { StoreConfigOptions } from './store-config-options'

export interface StoreConfigOptionsInfo extends StoreConfigOptions {
	storageTypeName: string,
	objectCompareTypeName: string,
}
