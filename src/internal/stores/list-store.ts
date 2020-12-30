import { isDev, SortFactory, SortingAlgorithmToken, SortMethodApi, SortOptions } from '../core'
import { assert, ClearableWeakMap, isArray, isFunction, isNull, isNumber, isObject, isString, isUndefined, objectFreeze, throwError } from '../helpers'
import { KeyOrNever, NoVoid, ObjectOrNever } from '../types'
import { SortMethod } from '../types/sort-method'
import { BaseStore } from './base-store'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'
import { Actions, Pipe, Project, ProjectsOrKeys, QueryableListStore, QueryableListStoreExtended, SetStateParam, State } from './store-accessories'


export class ListStore<S, E = any> extends BaseStore<S[], S, E> implements QueryableListStore<S> {

  //#region state

  /** @internal */
  protected readonly _idItemMap: Map<string | number, S> = new Map()

  /** @internal */
  protected readonly _itemIndexMap: ClearableWeakMap<S extends object ? S : never, number> = new ClearableWeakMap()

  /** @internal */
  protected set _state(value: State<S[], E>) {
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
  protected get _state(): State<S[], E> {
    return super._state
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
  //#region query-methods

  protected _assertIsQueryableListStoreExtended<T>(value: any): value is QueryableListStoreExtended<T, S> {
    assert(value._pipMethods, `Store: "${this._config.name}" has encountered an critical error durning piping..`)
    return true
  }

  /** @internal */
  protected _getQueryableListStore<T, R>(
    pipeOrActions: Pipe<T[], R[] | R> | (Actions | string)[],
    queryableListStore?: QueryableListStore<R> | QueryableListStoreExtended<R, S>,
  ): QueryableListStore<R> {
    if (!queryableListStore) {
      queryableListStore = {
        _actions: null,
        _pipMethods: [],
        _pipe: <B>(arr: S[], pipeMethods: Pipe<any[], any[]>[]): B[] | S[] => {
          pipeMethods.forEach((pipe, i) => {
            arr = pipe(arr, i, pipeMethods)
          })
          return arr
        },
        select: (projectsOrKeys: ProjectsOrKeys<R, any>) => this._select(projectsOrKeys, queryableListStore),
        where: (predicate: (value: R, index: number, array: R[]) => R) => this._where(predicate, queryableListStore),
        when: (actionOrActions: Actions | string | (Actions | string)[]) => this._when(actionOrActions, queryableListStore),
        orderBy: (partialSortOptions?: true | false | KeyOrNever<R> | SortOptions<R> | SortOptions<R>[], token?: SortingAlgorithmToken) =>
          this._orderBy(partialSortOptions, token, queryableListStore),
        // toList: (predicate?: ((value: S, index: number, array: S[]) => S) | null) => this._toList(predicate, queryableListStore),
        // firstOrDefault: (predicate?: (value: S, index: number, array: S[]) => S) => this._firstOrDefault(predicate, queryableListStore),
        // first: (predicate?: (value: S, index: number, array: S[]) => S) => this._first(predicate, queryableListStore)
      }
    }
    if (this._assertIsQueryableListStoreExtended<T>(queryableListStore)) {
      if (isArray(pipeOrActions)) {
        if (!queryableListStore._actions) queryableListStore._actions = [...pipeOrActions]
        queryableListStore._actions = [...pipeOrActions, ...pipeOrActions]
      } else {
        queryableListStore._pipMethods.push(pipeOrActions)
      }
    }
    return queryableListStore
  }

  /** @internal */
  protected _select<T, R>(
    projectsOrKeys: ProjectsOrKeys<T, R>,
    queryableListStore?: QueryableListStore<R>
  ): QueryableListStore<R> {
    const project: Project<T, R> = this._getProjectionMethod(projectsOrKeys)
    const mapper: Pipe<T[], R[]> = (arr: T[]) => arr.map(project) as R[]
    return this._getQueryableListStore<T, R>(mapper, queryableListStore)
  }

  public select<R>(project: (value: Readonly<S>) => NoVoid<R>): QueryableListStore<R>
  public select<R extends ReturnType<U>, U extends (value: Readonly<S>) => NoVoid<any>>(projects: U[]): QueryableListStore<R>
  public select<R extends any[]>(projects: ((value: Readonly<S>) => NoVoid<any>)[]): QueryableListStore<R>
  public select<R, K extends keyof S>(key: K): QueryableListStore<R>
  public select<R, K extends keyof S>(keys: K[]): QueryableListStore<R>
  public select<R>(dynamic: ProjectsOrKeys<S, R>): QueryableListStore<R>
  public select<R>(projectsOrKeys: ProjectsOrKeys<S, R>): QueryableListStore<R> {
    return this._select<S, R>(projectsOrKeys)
  }

  /** @internal */
  protected _where<R>(
    predicate: (value: R, index: number, array: R[]) => R,
    queryableListStore?: QueryableListStore<R>
  ): QueryableListStore<R> {
    const filter: Pipe<R[], R[] | R> = (arr: R[]) => arr.filter(predicate)
    return this._getQueryableListStore(filter, queryableListStore)
  }

  public where(predicate: (value: S, index: number, array: S[]) => S): QueryableListStore<S> {
    return this._where(predicate)
  }

  /** @internal */
  protected _when<R>(
    actionOrActions: Actions | string | (Actions | string)[],
    queryableListStore?: QueryableListStore<R>
  ): QueryableListStore<R> {
    return this._getQueryableListStore(isArray(actionOrActions) ? actionOrActions : [actionOrActions], queryableListStore)
  }

  public when(action: Actions | string): QueryableListStore<S>
  public when(actions: (Actions | string)[]): QueryableListStore<S>
  public when(actionOrActions: Actions | string | (Actions | string)[]): QueryableListStore<S>
  public when(actionOrActions: Actions | string | (Actions | string)[]): QueryableListStore<S> {
    return this._when(actionOrActions)
  }

  /** @internal */
  protected _orderBy<R>(
    partialSortOptions?: true | false | KeyOrNever<R> | SortOptions<R> | SortOptions<R>[],
    token?: SortingAlgorithmToken,
    queryableListStore?: QueryableListStore<R>
  ): QueryableListStore<R> {
    const sortingApi: SortMethodApi<R> = SortFactory.create(partialSortOptions)
    if (token) sortingApi.setSortingAlgorithm(token)
    return this._getQueryableListStore(sortingApi, queryableListStore)
  }

  public orderBy(desc?: false, token?: SortingAlgorithmToken): QueryableListStore<S>
  public orderBy(desc: true, token?: SortingAlgorithmToken): QueryableListStore<S>
  public orderBy(key: KeyOrNever<S>, token?: SortingAlgorithmToken): QueryableListStore<S>
  public orderBy(sortOptions: SortOptions<S>, token?: SortingAlgorithmToken): QueryableListStore<S>
  public orderBy(sortOptions: SortOptions<S>[], token?: SortingAlgorithmToken): QueryableListStore<S>
  public orderBy(
    dynamic?: true | false | KeyOrNever<S> | SortOptions<S> | SortOptions<S>[],
    token?: SortingAlgorithmToken
  ): QueryableListStore<S>
  public orderBy(
    partialSortOptions?: true | false | KeyOrNever<S> | SortOptions<S> | SortOptions<S>[],
    token?: SortingAlgorithmToken
  ): QueryableListStore<S> {
    return this._orderBy(partialSortOptions, token)
  }

  /** @internal */
  // protected _toList<R>(
  //   predicate?: ((value: T | R, index: number, array: T[] | R[]) => T | R) | null,
  //   queryableListStore?: QueryableListStore<T, T>
  // ): T[] | R[] {
  //   let value: T[] | R[] | null = this._value ? [...this._value] : null
  //   assert(value, `Store: "${this._storeName}" has tried to access state's value before initialization.`)
  //   if (queryableListStore) {
  //     if (queryableListStore.filterPredicate) value = value.filter(predicate || queryableListStore.filterPredicate)
  //     if (queryableListStore.project) value = value.map(queryableListStore.project) as T[] | R[]
  //     if (queryableListStore.sortingMethod) value = queryableListStore.sortingMethod(value)
  //   } else if (predicate) {
  //     value = value.filter(predicate)
  //   }
  //   return this._clone(value) as T[] | R[]
  // }

  // public toList(): T[]
  // public toList<R>(): R[]
  // public toList(predicate: (value: T, index: number, array: T[]) => T): T[]
  // public toList<R>(predicate: (value: R, index: number, array: R[]) => T): R[]
  // public toList<R>(predicate?: (value: T | R, index: number, array: T[] | R[]) => T | R): T[] | R[] {
  //   return this._toList(predicate)
  // }

  /** @internal */
  // protected _firstOrDefault<R>(
  //   predicate?: (value: T, index: number, array: T[]) => T,
  //   queryableListStore?: QueryableListStore<T, T>
  // ): T | R | null {
  //   let value: T[] | R[] | null = this._value ? [...this._value] : null
  //   if (!value) return value
  //   let result: T | R | null = null
  //   if (queryableListStore) {
  //     if (queryableListStore.sortingMethod) value = queryableListStore.sortingMethod(value) as T[]
  //     if (queryableListStore.filterPredicate) result = value.find(predicate || queryableListStore.filterPredicate) ?? null
  //   } else if (predicate) {
  //     result = value.find(predicate) ?? null
  //   }
  //   if (queryableListStore && queryableListStore.project && result) result = queryableListStore.project(result)
  //   return isObject(result) ? this._clone(result) : result
  // }

  // public firstOrDefault(): T | null
  // public firstOrDefault<R>(): R | null
  // public firstOrDefault(predicate: (value: T, index: number, array: T[]) => T): T | null
  // public firstOrDefault<R>(predicate: (value: T, index: number, array: T[]) => T): R | null
  // public firstOrDefault<R>(predicate?: (value: T, index: number, array: T[]) => T): T | R | null {
  //   return this._firstOrDefault(predicate)
  // }

  /** @internal */
  // protected _first<R>(
  //   predicate?: (value: T, index: number, array: T[]) => T,
  //   queryableListStore?: QueryableListStore<T, T>
  // ): T | R | never {
  //   const result: T | R | null = this._firstOrDefault(predicate, queryableListStore)
  //   return isEmpty(result) ? throwError(`Store: "${this._storeName}" has resolved a null value by first method.`) : result
  // }

  // public first(): T | never
  // public first<R>(): R | never
  // public first(predicate: (value: T, index: number, array: T[]) => T): T | never
  // public first<R>(predicate: (value: T, index: number, array: T[]) => T): R | never
  // public first<R>(predicate?: (value: T, index: number, array: T[]) => T): T | R | never {
  //   return this._first(predicate)
  // }

  //#endregion query-methods
}
