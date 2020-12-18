import { StoreConfigOptions } from './store-config-options.interface'

/**
 * List Store configuration options.
 */
export interface ListStoreConfigOptions<T extends object> extends StoreConfigOptions {
  /**
   * Used for fast list's element access.
   * @default
   * idKey = '_id'
   */
  idKey?: keyof T | null,
}
