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
   * Sets the Storage key.
   * - If not configured, stores name will be used as a Storage key instead.
   * @default
   * key = "{storesName}"
   */
  storageKey?: string,
}
