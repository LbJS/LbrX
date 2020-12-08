import { assert } from '../helpers'
import { BaseStore } from './base-store'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'


export class ListStore<T extends object, E = any> extends BaseStore<T[], T, E> {

  //#region state

  /** @internal */
  protected _map = new Map<any, T>()

  //#region state
  //#endregion config

  protected readonly _config!: ListStoreConfigCompleteInfo<T>

  /**
   * @get Returns store's configuration.
   */
  public get config(): ListStoreConfigCompleteInfo<T> {
    return this._config
  }

  /** @internal */
  protected readonly _id: keyof T | null

  /** @internal */
  protected readonly _idRetrievalMethod: ((obj: {}) => any) | null

  /** @internal */
  protected readonly _isIdMapping: boolean

  //#endregion config
  //#region constructor

  /**
   * Synchronous initialization.
   */
  constructor(initialValue: T[], storeConfig?: ListStoreConfigOptions<T>)
  /**
   * Asynchronous or delayed initialization.
   * The store will be set into loading state till initialization.
   */
  constructor(initialValue: null, storeConfig?: ListStoreConfigOptions<T>)
  /**
   * Dynamic initialization.
   */
  constructor(initialValue: T[] | null, storeConfig?: ListStoreConfigOptions<T>)
  constructor(initialValueOrNull: T[] | null, storeConfig?: ListStoreConfigOptions<T>) {
    super(initialValueOrNull, storeConfig)
    assert(this._config, `List Store configuration could not be resolved.`)
    const config = this._config
    config.isIdMapping = !!config.isIdMapping
    config.idRetrievalMethod = config.idRetrievalMethod ? config.idRetrievalMethod : null
    config.id = config.id ? config.id : null
    this._isIdMapping = config.isIdMapping
    if (config.isIdMapping) {
      this._idRetrievalMethod = config.idRetrievalMethod
      this._id = this._idRetrievalMethod ? null : config.id
    } else {
      this._id = null
      this._idRetrievalMethod = null
    }
  }

  //#endregion constructor
  //#region initialization-methods

  /** @internal */
  protected _initializeStore(initialValue: T[], isAsync: boolean): void {
    super._initializeStore(initialValue, isAsync)
    const value = this._value
    assert(value, `Store: "${this._config.name}" could not be initialized with the given initial value.`)
    this._mapSetList(value)
  }

  //#endregion initialization-methods
  //#region state-methods

  /** @internal */
  protected _mapSetList(initialValue: T[] | Readonly<T[]>): void {
    if (this._isIdMapping) return
    initialValue.forEach(x => {
      this._mapSet(x)
    })
  }

  /** @internal */
  protected _mapSet(value: T): void { // TODO: error handling for missing value in key
    if (this._id) this._map.set(this._id, value)
    else if (this._idRetrievalMethod) this._map.set(this._idRetrievalMethod(value), value)
  }

  //#endregion state-methods
}
