import { isDev, isStackTracingErrors, SortFactory } from '../core'
import { assert, isArray, isCalledBy, isFunction, isNull, isUndefined, logError, objectAssign, objectFreeze, throwError } from '../helpers'
import { KeyValue } from '../types'
import { SortMethod } from '../types/sort-method'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'
import { QueryableListStoreAdapter } from './queryable-list-store-adapter'
import { Actions, SetStateParam, State } from './store-accessories'


export class ListStore<S extends object, Id extends string | number | symbol = string, E = any> extends QueryableListStoreAdapter<S, E> {

  //#region state

  /** @internal */
  protected _hashTable: KeyValue<string | number | symbol, S> = {}

  /** @internal */
  protected get _state(): State<S[], E> {
    return objectAssign({}, this._stateSource)
  }
  protected set _state(value: State<S[], E>) {
    if (isStackTracingErrors() && isDev() && !isCalledBy(`_setState`, 0)) {
      logError(`Store: "${this._storeName}" has called "_state" setter not from "_setState" method.`)
    }
    this._hashTable = {}
    if (value.value) {
      value.value = this._sortHandler(value.value)
      if (this._assertValidIds(value.value)) {
        const idKey = this._idKey as string
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < value.value.length; i++) {
          this._hashTable[idKey] = value.value[i]
        }
      }
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
  protected _sortHandler(value: Readonly<S[]>): Readonly<S[]> {
    if (isNull(this._sort)) return value
    value = this._sort(isDev() ? [...value] : value as S[])
    return isDev() ? objectFreeze(value) : value
  }

  /** @internal */
  protected _assertValidIds(value: S[] | Readonly<S[]>): boolean | never {
    const idKey = this._idKey
    if (!idKey) return false
    const set = new Set<any>()
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < value.length; i++) {
      set.add(value[i][idKey])
    }
    if (value.length != set.size) throwError(`Store: "${this._storeName}" has received a duplicate key.`)
    return true
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
    if (!value || this.isPaused) return false
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
    if (!value || this.isPaused) return 0
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

  public delete(id: Id): boolean
  public delete(ids: Id[]): number
  public delete(idOrIds: Id | Id[]): boolean | number {
    const isArr = isArray(idOrIds)
    if (!isArr) idOrIds = [idOrIds] as Id[]
    const idKey = this._idKey
    const value: S[] | null = this._value ? [...this._value] : null
    if (!idKey || !value || this.isPaused) return isArr ? 0 : false
    const filteredValue = value.filter(x => !(idOrIds as Id[]).includes(x[idKey] as any))
    const deletedCount = value.length - filteredValue.length
    if (deletedCount) {
      this._setState({
        valueFnOrState: { value: this._isImmutable ? objectFreeze(filteredValue) : filteredValue },
        actionName: Actions.delete,
        doSkipFreeze: true,
        doSkipClone: true,
      })
    }
    return isArr ? deletedCount : false
  }

  public clear(): boolean {
    if (this.isPaused) return false
    const countOrNull: number | null = this._value ? this._value.length : null
    if (countOrNull) {
      this._setState({
        valueFnOrState: { value: this._isImmutable ? objectFreeze([]) : [] },
        actionName: Actions.removeRange,
        doSkipFreeze: true,
        doSkipClone: true,
      })
    }
    return !!countOrNull
  }

  //#endregion delete-methods
  //#region add-or-update-methods

  public add(item: S): void
  public add(items: S[]): void
  public add(itemOrItems: S | S[]): void {
    if (this.isPaused) return
    const value: S[] = this._value ? [...this._value] : []
    assert(this.isInitialized, `Store: "${this._storeName}" can't add items to store before it was initialized.`)
    if (isArray(itemOrItems)) {
      if (!itemOrItems.length) return
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < itemOrItems.length; i++) {
        value.push(itemOrItems[i])
      }
    } else {
      value.push(itemOrItems)
    }
    this._setState({
      valueFnOrState: { value: this._isImmutable ? objectFreeze(value) : value },
      actionName: Actions.add,
      doSkipFreeze: true,
      doSkipClone: true,
    })
  }

  public set(items: S[]): void {
    if (this.isPaused) return
    assert(this.isInitialized, `Store: "${this._storeName}" can't set items to store before it was initialized.`)
    this._setState({
      valueFnOrState: { value: items },
      actionName: Actions.set,
    })
  }

  //#endregion add-or-update-methods
  //#region query-methods

  public has(id: Id): boolean {
    return this._idKey ? !!this._hashTable[id] : false
  }

  //#endregion query-methods
}
