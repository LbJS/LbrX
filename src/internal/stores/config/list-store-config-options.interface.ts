import { SortOptions } from '../../core'
import { Sort } from '../store-accessories'
import { StoreConfigOptions } from './store-config-options.interface'

/**
 * List Store configuration options.
 */
export interface ListStoreConfigOptions<T> extends StoreConfigOptions {
  /**
   * Used for fast list's element access.
   * @default
   * idKey = '_id'
   */
  idKey?: keyof T | null,
  /**
   * Configures the default sorting mechanism.
   * @default
   * orderBy = null
   */
  orderBy?: Sort<T> | keyof T | SortOptions<T> | SortOptions<T>[] | null
}
