import { GlobalStoreConfigOptions } from './global-store-config-options.interface'
import { ListStoreConfigOptions } from './list-store-config-options.interface'

/**
 * Global store configuration options.
 */
export interface GlobalListStoreConfigOptions extends GlobalStoreConfigOptions, Pick<ListStoreConfigOptions<any>, 'idKey'> { }
