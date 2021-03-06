import { BaseStoreConfigOptions } from './base-store-config-options.interface'

/**
 * Store configuration options.
 */
export interface StoreConfigOptions extends BaseStoreConfigOptions {
  /**
   * Store's name will be used for Redux DevTools and cache storage's key if storage is configured.
   * @warning Store's name must be unique!
   */
  name: string,
  /**
   * Sets the key for the value.
   * - If not configures, stores name will be used instead.
   * @default
   * key = "{storesName}"
   */
  storageKey?: string,
}
