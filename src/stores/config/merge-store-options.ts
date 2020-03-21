import { GlobalStoreConfigOptions } from './global-store-config-options'
import { StoreConfigOptions } from './store-config-options'
import { objectAssign } from 'lbrx/helpers'

export type AnyStoreConfigOptions = GlobalStoreConfigOptions | StoreConfigOptions

export function mergeStoreOptions(baseOptions: AnyStoreConfigOptions, newOptions: AnyStoreConfigOptions): AnyStoreConfigOptions {
	return objectAssign(baseOptions, newOptions)
}
