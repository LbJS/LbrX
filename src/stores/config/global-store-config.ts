import { GlobalStoreConfigOptions } from './global-store-config-options'

export let globalStoreOptions: GlobalStoreConfigOptions = {}

export function setGlobalStoreConfig(options: GlobalStoreConfigOptions): void {
	globalStoreOptions = options
}
