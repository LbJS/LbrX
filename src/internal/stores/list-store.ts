import { BaseStore } from './base-store'
import { StoreConfigOptions } from './config'

// TODO: Work in progress...

export class ListStore<T extends object, E = any> extends BaseStore<T[], E> {

  //#region constructor

  /**
   * @param initialValue - Null as an initial state will activate stores loading state.
   * @param storeConfig ? - Set this parameter only if you creating
   * store's instance without extending it.
   */
  constructor(initialValue: null, storeConfig?: StoreConfigOptions)
  /**
   * @param initialValue - Set all state's params for the initial value. Use Null for
   * unneeded properties instead of undefined.
   * @param storeConfig ?- Set this parameter only if you creating
   * store's instance without extending it.
   */
  constructor(initialValue: T[], storeConfig?: StoreConfigOptions)
  constructor(initialValueOrNull: T[] | null, storeConfig?: StoreConfigOptions) {
    super(initialValueOrNull, storeConfig)
  }

  //#endregion constructor
}
