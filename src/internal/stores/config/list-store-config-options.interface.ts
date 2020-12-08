import { StoreConfigOptions } from './store-config-options.interface'

/**
 * List Store configuration options.
 */
export interface ListStoreConfigOptions<T extends object> extends StoreConfigOptions {
  /**
   * Used for fast list's element access.
   * @default
   * id = `id`
   */
  id?: keyof T | null,
  /**
   * Enables/ disables list's `id` mapping for fast element access.
   * @default
   * useIdMapping = true
   */
  isIdMapping?: boolean,
  /**
   * Method for retrieving nested id value.
   * - This method will be called only if configured.
   * @default
   * idRetrievalMethod = null
   */
  idRetrievalMethod?: ((obj: {}) => any) | null
}
