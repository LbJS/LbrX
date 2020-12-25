import { assert, isArray, isNumber, isString, isUndefined, throwError } from '../helpers'
import { BaseStore } from './base-store'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'
import { SetStateParam } from './store-accessories'


export class ListStore<T extends object, E = any> extends BaseStore<T[], T, E> {

  //#region state

  /** @internal */
  protected readonly _idItemMap: Map<string | number, T> = new Map()

  /** @internal */
  protected readonly _itemIndexMap: WeakMap<T, number> = new WeakMap()

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
  protected readonly _idKey: keyof T | null

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
    super(storeConfig)
    const config = this._config
    this._idKey = config.idKey = config.idKey || null
    this._preInit(initialValueOrNull)
  }

  //#endregion constructor
  //#region helper-methods

  /** @internal */
  protected _assertValidId(value: any): value is string | number {
    if (this._idItemMap.has(value)) {
      throwError(`Store: "${this._config.name}" has been provided with duplicate id keys. Duplicate key: ${value}.`)
    } else if (!isString(value) && !isNumber(value)) {
      throwError(`Store: "${this._config.name}" has been provided with key that is not a string and nor a number.`)
    }
    return true
  }

  //#endregion helper-methods
  //#region initialization-methods

  /** @internal */
  protected _initializeStore(initialValue: T[], isAsync: boolean): void {
    super._initializeStore(initialValue, isAsync)
    const value = this._value
    assert(value, `Store: "${this._config.name}" could not be initialized with the given initial value.`)
    this._setIdItemMap(value)
    value.forEach((x, i) => this._setItemIndexMap(x, i))
  }

  //#endregion initialization-methods
  //#region state-methods

  /** @internal */
  protected _setIdItemMap(value: T[] | Readonly<T[]> | T | Readonly<T>): void {
    const idKey = this._idKey
    if (!idKey) return
    const setPredicate = (x: T) => {
      const y = x[idKey]
      if (this._assertValidId(y)) this._idItemMap.set(y, x)
    }
    if (isArray(value)) value.forEach(setPredicate)
    else setPredicate(value as T)
  }

  /** @internal */
  protected _setItemIndexMap(value: T | Readonly<T>, index: number): void {
    this._itemIndexMap.set(value, index)
  }

  /** @internal */
  protected _setState({
    valueFnOrState,
    actionName,
    stateExtension,
    doSkipClone,
    doSkipFreeze,
  }: SetStateParam<T[], E>): void {
    super._setState({
      valueFnOrState,
      actionName,
      stateExtension,
      doSkipClone: isUndefined(doSkipClone) ? false : doSkipClone,
      doSkipFreeze: isUndefined(doSkipFreeze) ? false : doSkipFreeze,
    })
  }

  //#endregion state-methods
}
