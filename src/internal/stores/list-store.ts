import { isDev, SortFactory, SortingAlgorithmToken, SortMethodApi, SortOptions } from '../core'
import { assert, ClearableWeakMap, isArray, isEmpty, isFunction, isNull, isNumber, isObject, isString, isUndefined, objectAssign, objectFreeze, throwError } from '../helpers'
import { SortMethod } from '../types/sort-method'
import { BaseStore } from './base-store'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'
import { Actions, ProjectsOrKeys, QueryableListStore, SetStateParam, State } from './store-accessories'


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
  //#region query-methods

  /** @internal */
  protected _getQueryableListStore(
    partialQueryableListStore: Partial<QueryableListStore<any, T>>,
    queryableListStore?: QueryableListStore<any, T>,
  ): QueryableListStore<any, T> {
    queryableListStore = queryableListStore ? objectAssign(queryableListStore, partialQueryableListStore) : objectAssign({
      select: <R>(projectsOrKeys: ProjectsOrKeys<T, R>) => this._select(projectsOrKeys, queryableListStore),
      where: (predicate: (value: T, index: number, array: T[]) => T) => this._where(predicate, queryableListStore),
      when: (actionOrActions: Actions | string | (Actions | string)[]) => this._when(actionOrActions, queryableListStore),
      orderBy: (partialSortOptions: keyof T | SortOptions<T> | SortOptions<T>[], token?: SortingAlgorithmToken) =>
        this._orderBy(partialSortOptions, token, queryableListStore),
      toList: (predicate?: ((value: T, index: number, array: T[]) => T) | null) => this._toList(predicate, queryableListStore),
      firstOrDefault: (predicate?: (value: T, index: number, array: T[]) => T) => this._firstOrDefault(predicate, queryableListStore),
      first: (predicate?: (value: T, index: number, array: T[]) => T) => this._first(predicate, queryableListStore)
    }, partialQueryableListStore)
    return queryableListStore
  }

  /** @internal */
  protected _select<R, K extends keyof T>(
    projectsOrKeys: ProjectsOrKeys<T, R>,
    queryableListStore?: QueryableListStore<T | R, T>
  ): QueryableListStore<T | R, T> {
    const project: (value: Readonly<T>) => T | R | any[] | T[K] | Pick<T, K> = this._getProjectionMethod(projectsOrKeys)
    return this._getQueryableListStore({ project }, queryableListStore)
  }

  public select<R>(project: (value: Readonly<T>) => R): QueryableListStore<R, T, E>
  public select<R extends ReturnType<M>, M extends ((value: Readonly<T>) => any)>(projects: M[]): QueryableListStore<R, T, E>
  public select<R extends any[]>(projects: ((value: Readonly<T>) => any)[]): QueryableListStore<R, T, E>
  public select<K extends keyof T>(key: K): QueryableListStore<T, T, E>
  public select<K extends keyof T>(keys: K[]): QueryableListStore<T, T, E>
  public select<R>(dynamic: ProjectsOrKeys<T, R>): QueryableListStore<R, T, E>
  public select<R, K extends keyof T>(projectsOrKeys: ProjectsOrKeys<T, R>): QueryableListStore<T | R, T, E> {
    return this._select<R, K>(projectsOrKeys)
  }

  /** @internal */
  protected _where(
    predicate: (value: T, index: number, array: T[]) => T,
    queryableListStore?: QueryableListStore<T, T>
  ): QueryableListStore<T, T> {
    return this._getQueryableListStore({ filterPredicate: predicate }, queryableListStore)
  }

  public where(predicate: (value: T, index: number, array: T[]) => T): QueryableListStore<T, T, E>
  public where(predicate: (value: T, index: number, array: T[]) => T): QueryableListStore<T, T, E> {
    return this._where(predicate)
  }

  /** @internal */
  protected _when(
    actionOrActions: Actions | string | (Actions | string)[],
    queryableListStore?: QueryableListStore<T, T>
  ): QueryableListStore<T, T> {
    return this._getQueryableListStore({ onActions: isArray(actionOrActions) ? actionOrActions : [actionOrActions] }, queryableListStore)
  }

  public when(action: Actions | string): QueryableListStore<T, T, E>
  public when(actions: (Actions | string)[]): QueryableListStore<T, T, E>
  public when(actionOrActions: Actions | string | (Actions | string)[]): QueryableListStore<T, T, E>
  public when(actionOrActions: Actions | string | (Actions | string)[]): QueryableListStore<T, T, E> {
    return this._when(actionOrActions)
  }

  /** @internal */
  protected _orderBy(
    partialSortOptions: keyof T | SortOptions<T> | SortOptions<T>[],
    token?: SortingAlgorithmToken,
    queryableListStore?: QueryableListStore<T, T>
  ): any {
    const sortingApi: SortMethodApi<T> = SortFactory.create(partialSortOptions)
    if (token) sortingApi.setSortingAlgorithm(token)
    return this._getQueryableListStore({ sortingMethod: sortingApi }, queryableListStore)
  }

  public orderBy(key: keyof T, token?: SortingAlgorithmToken): QueryableListStore<T, T, E>
  public orderBy(sortOptions: SortOptions<T>, token?: SortingAlgorithmToken): QueryableListStore<T, T, E>
  public orderBy(sortOptions: SortOptions<T>[], token?: SortingAlgorithmToken): QueryableListStore<T, T, E>
  public orderBy(dynamic: keyof T | SortOptions<T> | SortOptions<T>[], token?: SortingAlgorithmToken): QueryableListStore<T, T, E>
  public orderBy(
    partialSortOptions: keyof T | SortOptions<T> | SortOptions<T>[],
    token?: SortingAlgorithmToken
  ): QueryableListStore<T, T, E> {
    return this._orderBy(partialSortOptions, token)
  }

  /** @internal */
  protected _toList<R>(
    predicate?: ((value: T, index: number, array: T[]) => T) | null,
    queryableListStore?: QueryableListStore<T, T>
  ): T[] | R[] {
    let value: T[] | R[] | null = this._value ? [...this._value] : null
    assert(value, `Store: "${this._storeName}" has tried to access state's value before initialization.`)
    if (queryableListStore) {
      if (queryableListStore.filterPredicate) value = value.filter(predicate || queryableListStore.filterPredicate)
      if (queryableListStore.project) value = value.map(queryableListStore.project) as T[] | R[]
      if (queryableListStore.sortingMethod) value = queryableListStore.sortingMethod(value)
    } else if (predicate) {
      value = value.filter(predicate)
    }
    return this._clone(value) as T[] | R[]
  }

  public toList(): T[]
  public toList<R>(): R[]
  public toList(predicate: (value: T, index: number, array: T[]) => T): T[]
  public toList<R>(predicate: (value: T, index: number, array: T[]) => T): R[]
  public toList<R>(predicate?: (value: T, index: number, array: T[]) => T): T[] | R[] {
    return this._toList(predicate)
  }

  /** @internal */
  protected _firstOrDefault<R>(
    predicate?: (value: T, index: number, array: T[]) => T,
    queryableListStore?: QueryableListStore<T, T>
  ): T | R | null {
    let value: T[] | R[] | null = this._value ? [...this._value] : null
    if (!value) return value
    let result: T | R | null = null
    if (queryableListStore) {
      if (queryableListStore.sortingMethod) value = queryableListStore.sortingMethod(value) as T[]
      if (queryableListStore.filterPredicate) result = value.find(predicate || queryableListStore.filterPredicate) ?? null
    } else if (predicate) {
      result = value.find(predicate) ?? null
    }
    if (queryableListStore && queryableListStore.project && result) result = queryableListStore.project(result)
    return isObject(result) ? this._clone(result) : result
  }

  public firstOrDefault(): T | null
  public firstOrDefault<R>(): R | null
  public firstOrDefault(predicate: (value: T, index: number, array: T[]) => T): T | null
  public firstOrDefault<R>(predicate: (value: T, index: number, array: T[]) => T): R | null
  public firstOrDefault<R>(predicate?: (value: T, index: number, array: T[]) => T): T | R | null {
    return this._firstOrDefault(predicate)
  }

  /** @internal */
  protected _first<R>(
    predicate?: (value: T, index: number, array: T[]) => T,
    queryableListStore?: QueryableListStore<T, T>
  ): T | R | never {
    const result: T | R | null = this._firstOrDefault(predicate, queryableListStore)
    return isEmpty(result) ? throwError(`Store: "${this._storeName}" has resolved a null value by first method.`) : result
  }

  public first(): T | never
  public first<R>(): R | never
  public first(predicate: (value: T, index: number, array: T[]) => T): T | never
  public first<R>(predicate: (value: T, index: number, array: T[]) => T): R | never
  public first<R>(predicate?: (value: T, index: number, array: T[]) => T): T | R | never {
    return this._first(predicate)
  }

  //#endregion query-methods
}
