import { Class } from '../../types'
import { ListStoreConfigOptions } from './list-store-config-options.interface'
import { StoreConfig } from './store-config.decorator'

export function ListStoreConfig<T extends object>(options: ListStoreConfigOptions<T>): <C extends Class>(constructor: C) => void {
  return StoreConfig(options)
}
