import { isDev, isStackTracingErrors, SortFactory } from '../core'
import { isCalledBy, isFunction, isNull, isUndefined, logError, objectAssign, objectFreeze, throwError } from '../helpers'
import { SortMethod } from '../types/sort-method'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'
import { QueryableListStoreAdapter } from './queryable-list-store-adapter'
import { Actions, SetStateParam, State } from './store-accessories'


export class ListStore<S extends object, E = any> extends QueryableListStoreAdapter<S, E> {

  //#region state

  /** @internal */
  protected get _state(): State<S[], E> {
    return objectAssign({}, this._stateSource)
  }
  protected set _state(value: State<S[], E>) {
    if (isStackTracingErrors() && isDev() && !isCalledBy(`_setState`, 0)) {
      logError(`Store: "${this._storeName}" has called "_state" setter not from "_setState" method.`)
    }
    if (value.value) {
      value.value = this._sortLogic(value.value)
      this._assertValidIds(value.value)
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

  /** @internal */
  protected readonly _isImmutable: boolean

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
    this._isImmutable = config.isImmutable
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
  protected _sortLogic(value: Readonly<S[]>): Readonly<S[]> {
    if (isNull(this._sort)) return value
    value = this._sort(isDev() ? [...value] : value as S[])
    return isDev() ? objectFreeze(value) : value
  }

  /** @internal */
  protected _assertValidIds(value: S[] | Readonly<S[]>): void | never {
    const idKey = this._idKey
    if (!idKey) return
    const set = new Set<any>()
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < value.length; i++) {
      set.add(value[i][idKey])
    }
    if (value.length != set.size) throwError(`Store: "${this._storeName}" has received a duplicate key.`)
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

  //#endregion state-methods
  //#region delete-methods

  public remove(predicate: (value: S, index: number, array: S[]) => boolean): boolean {
    const value: S[] | null = this._value ? [...this._value] : null
    if (!value) return false
    const index = value.findIndex(predicate)
    const isExist = index > -1
    if (isExist) {
      value.splice(index, 1)
      this._setState({
        valueFnOrState: { value: this._isImmutable ? objectFreeze(value) : value },
        actionName: Actions.removeRange,
        doSkipFreeze: true,
        doSkipClone: true,
      })
    }
    return isExist
  }

  public removeRange(predicate: (value: S, index: number, array: S[]) => boolean): number {
    const value: S[] | null = this._value ? [...this._value] : null
    if (!value) return 0
    const indexesToRemove: number[] = []
    value.forEach((x, i, a) => {
      if (predicate(x, i, a)) indexesToRemove.push(i)
    })
    if (indexesToRemove.length) {
      let i = indexesToRemove.length
      while (i--) {
        const index = indexesToRemove[i]
        value.splice(index, 1)
      }
      this._setState({
        valueFnOrState: { value: this._isImmutable ? objectFreeze(value) : value },
        actionName: Actions.removeRange,
        doSkipFreeze: true,
        doSkipClone: true,
      })
    }
    return indexesToRemove.length
  }

  public clear(): boolean {
    const countOrNull: number | null = this._value ? this._value.length : null
    if (!countOrNull) return false
    this._setState({
      valueFnOrState: { value: this._isImmutable ? objectFreeze([]) : [] },
      actionName: Actions.removeRange,
      doSkipFreeze: true,
      doSkipClone: true,
    })
    return true
  }

  //#endregion delete-methods
}
