import { BaseStore } from './base-store'
import { StoreConfigOptions } from './config'

// TODO: Work in progress...

export class ListStore<T extends object, E = any> extends BaseStore<T[], T, E> {

  //#region constructor

  /**
   * Synchronous initialization.
   */
  constructor(initialValue: T[], storeConfig?: StoreConfigOptions)
  /**
   * Asynchronous or delayed initialization.
   * The store will be set into loading state till initialization.
   */
  constructor(initialValue: null, storeConfig?: StoreConfigOptions)
  /**
   * Dynamic initialization.
   */
  constructor(initialValue: T[] | null, storeConfig?: StoreConfigOptions)
  constructor(initialValueOrNull: T[] | null, storeConfig?: StoreConfigOptions) {
    super(initialValueOrNull, storeConfig)
  }

  //#endregion constructor
}
