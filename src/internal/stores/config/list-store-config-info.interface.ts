import { ListStoreConfigOptions } from './list-store-config-options.interface'
import { StoreConfigCompleteInfo } from './store-config-info.interface'

export interface ListStoreConfigCompleteInfo<T extends object> extends StoreConfigCompleteInfo, Required<ListStoreConfigOptions<T>> { }
