import { isDev, isStackTracingErrors, SortFactory } from '../core'
import { ClearableWeakMap, isArray, isCalledBy, isFunction, isNull, isNumber, isObject, isString, isUndefined, logError, objectAssign, objectFreeze, throwError } from '../helpers'
import { ObjectOrNever } from '../types'
import { SortMethod } from '../types/sort-method'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'
import { QueryableListStoreAdapter } from './queryable-list-store-adapter'
import { SetStateParam, State } from './store-accessories'


export class ListStore<S extends object, E = any> extends QueryableListStoreAdapter<S, E> {

  //#region state

  /** @internal */
  protected readonly _idItemMap: Map<string | number, S> = new Map()

  /** @internal */
  protected readonly _itemIndexMap: ClearableWeakMap<S extends object ? S : never, number> = new ClearableWeakMap()

  /** @internal */
  protected get _state(): State<S[], E> {
    return objectAssign({}, this._stateSource)
  }
  protected set _state(value: State<S[], E>) {
    if (isStackTracingErrors() && isDev() && !isCalledBy(`_setState`, 0)) {
      logError(`Store: "${this._storeName}" has called "_state" setter not from "_setState" method.`)
    }
    if (value.value) {
      if (!this._value) {
        this._cleanMaps()
        this._setMaps(value.value)
        value.value = this._sortLogic(value.value)
      }
    } else {
      this._cleanMaps()
    }
    this._stateSource = value
    this._distributeState(value)
  }

  //#region state
  //#endregion config

  protected readonly _config!: ListStoreConfigCompleteInfo<S>

  /**
   * @get Returns store's configuration.
   */
  public get config(): ListStoreConfigCompleteInfo<S> {
    return this._config
  }

  /** @internal */
  protected readonly _idKey: keyof S | null

  /** @internal */
  protected readonly _sort: SortMethod<S> | null

  //#endregion config
  //#region constructor

  /**
   * Synchronous initialization.
   */
  constructor(initialValue: S[], storeConfig?: ListStoreConfigOptions<S>)
  /**
   * Asynchronous or delayed initialization.
   * The store will be set into loading state till initialization.
   */
  constructor(initialValue: null, storeConfig?: ListStoreConfigOptions<S>)
  /**
   * Dynamic initialization.
   */
  constructor(initialValue: S[] | null, storeConfig?: ListStoreConfigOptions<S>)
  constructor(initialValueOrNull: S[] | null, storeConfig?: ListStoreConfigOptions<S>) {
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
  protected _noSort(value: S[]): S[] {
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
  protected _sortLogic(value: Readonly<S[]>): Readonly<S[]> {
    if (isNull(this._sort)) return value
    value = this._sort(isDev() ? [...value] : value as S[])
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
  }: SetStateParam<S[], E>): void {
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
  protected _setMaps(value: S[] | Readonly<S[]>): void
  protected _setMaps(value: S | Readonly<S>, index: number): void
  protected _setMaps(value: S[] | Readonly<S[]> | S | Readonly<S>, index?: number): void {
    if (isArray(value) ? isObject(value[0]) : isObject(value)) {
      this._setIdItemMap(value as ObjectOrNever<S>[])
      this._setItemIndexMap(value as ObjectOrNever<S>, index as number)
    }
  }

  /** @internal */
  protected _setIdItemMap<T extends ObjectOrNever<S>>(value: T[] | Readonly<T[]> | T | Readonly<T>): void {
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
  protected _setItemIndexMap<T extends ObjectOrNever<S>>(value: T[] | Readonly<T[]>): void
  protected _setItemIndexMap<T extends ObjectOrNever<S>>(value: T | Readonly<T>, index: number): void
  protected _setItemIndexMap<T extends ObjectOrNever<S>>(value: T[] | Readonly<T[]> | T | Readonly<T>, index?: number): void {
    if (isArray(value)) value.forEach((x, i) => this._itemIndexMap.set(x, i))
    else if (isNumber(index)) this._itemIndexMap.set(value as T, index)
  }

  //#endregion state-methods
}
