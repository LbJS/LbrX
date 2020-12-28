import { isDev, SortFactory } from '../core'
import { ClearableWeakMap, isArray, isFunction, isNull, isNumber, isString, isUndefined, objectFreeze, throwError } from '../helpers'
import { SortMethod } from '../types/sort-method'
import { BaseStore } from './base-store'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'
import { SetStateParam, State } from './store-accessories'


export class ListStore<T extends object, E = any> extends BaseStore<T[], T, E> {

  //#region state

  /** @internal */
  protected readonly _idItemMap: Map<string | number, T> = new Map()

  /** @internal */
  protected readonly _itemIndexMap: ClearableWeakMap<T, number> = new ClearableWeakMap()

  /** @internal */
  protected set _state(value: State<T[], E>) {
    if (value.value) {
      if (!this._value) {
        this._cleanMaps()
        this._setMaps(value.value)
        value.value = this._sortLogic(value.value)
      }
    } else {
      this._cleanMaps()
    }
    super._state = value
  }
  protected get _state(): State<T[], E> {
    return super._state
  }

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

  /** @internal */
  protected readonly _sort: SortMethod<T> | null

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
    this._sort = config.orderBy ?
      isFunction(config.orderBy) ?
        config.orderBy :
        SortFactory.create(config.orderBy) :
      null
    this._preInit(initialValueOrNull)
  }

  //#endregion constructor
  //#region helper-methods

  /** @internal */
  protected _noSort(value: T[]): T[] {
    return value
  }

  /** @internal */
  protected _assertValidId(value: any): value is string | number {
    if (this._idItemMap.has(value)) {
      throwError(`Store: "${this._config.name}" has been provided with duplicate id keys. Duplicate key: ${value}.`)
    } else if (!isString(value) && !isNumber(value)) {
      throwError(`Store: "${this._config.name}" has been provided with key that is not a string and nor a number.`)
    }
    return true
  }

  /** @internal */
  protected _sortLogic(value: Readonly<T[]>): Readonly<T[]> {
    if (isNull(this._sort)) return value
    value = this._sort(isDev() ? [...value] : value as T[])
    return isDev() ? objectFreeze(value) : value
  }

  //#endregion helper-methods
  //#region state-methods

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

  /** @internal */
  protected _cleanMaps(): void {
    this._idItemMap.clear()
    this._itemIndexMap.clear()
  }

  /** @internal */
  protected _setMaps(value: T[] | Readonly<T[]>): void
  protected _setMaps(value: T | Readonly<T>, index: number): void
  protected _setMaps(value: T[] | Readonly<T[]> | T | Readonly<T>, index?: number): void {
    this._setIdItemMap(value)
    this._setItemIndexMap(value as any, index as any)
  }

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

  protected _setItemIndexMap(value: T[] | Readonly<T[]>): void
  protected _setItemIndexMap(value: T | Readonly<T>, index: number): void
  protected _setItemIndexMap(value: T[] | Readonly<T[]> | T | Readonly<T>, index?: number): void {
    if (isArray(value)) value.forEach((x, i) => this._itemIndexMap.set(x, i))
    else if (isNumber(index)) this._itemIndexMap.set(value as T, index)
  }

  //#endregion state-methods
}
