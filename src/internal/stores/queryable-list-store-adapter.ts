import { Observable } from 'rxjs'
import { SortFactory, SortingAlgorithmToken, SortMethodApi, SortOptions } from '../core'
import { assert, isArray, isEmpty, isNull, isObject, throwError } from '../helpers'
import { KeyOrNever, NoVoid } from '../types'
import { BaseStore } from './base-store'
import { ListStoreConfigOptions } from './config'
import { Actions, ChainableListStoreQuery, ChainableListStoreQueryExtended, Compare, Pipe, Project, ProjectsOrKeys } from './store-accessories'

export abstract class QueryableListStoreAdapter<S, E = any> extends BaseStore<S[], S, E> implements ChainableListStoreQuery<S> {

  //#region constructor

  constructor(storeConfig?: ListStoreConfigOptions<S>) {
    super(storeConfig)
  }

  //#endregion constructor
  //#region helper-methods

  /** @internal */
  protected _isQLSE<T>(value: any): value is ChainableListStoreQueryExtended<T, S> {
    return !!value._pipMethods
  }

  /** @internal */
  protected _createPipe<R>(queryableListStore: ChainableListStoreQueryExtended<R, S>): Pipe<S[], R[] | S[] | R | S | null> {
    return (value: S[]) => queryableListStore._pipe(value, queryableListStore._pipMethods)
  }

  //#region helper-methods
  //#region query-methods

  /** @internal */
  protected _getQueryableListStore<T, R>(
    pipeOrActions?: Pipe<T[], R[] | R> | (Actions | string)[],
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): ChainableListStoreQuery<R> {
    if (!queryableListStore) {
      queryableListStore = {
        _actions: null,
        _pipMethods: [],
        _compare: null,
        _pipe: <B>(arr: S[], pipeMethods: Pipe<any[], any[]>[]): B[] | S[] => {
          pipeMethods.forEach((pipe, i) => {
            arr = pipe(arr, i, pipeMethods)
          })
          return arr
        },
        setCompare: (compare: Compare) => this._setCompare(compare, queryableListStore),
        when: (actionOrActions: Actions | string | (Actions | string)[]) => this._when(actionOrActions, queryableListStore),
        select: (projectsOrKeys: ProjectsOrKeys<R, any>) => this._select(projectsOrKeys, queryableListStore),
        where: (predicate: (value: R, index: number, array: R[]) => boolean) => this._where(predicate, queryableListStore),
        orderBy: (partialSortOptions?: true | false | KeyOrNever<R> | SortOptions<R> | SortOptions<R>[], token?: SortingAlgorithmToken) =>
          this._orderBy(partialSortOptions, token, queryableListStore),
        toList: (predicate?: (value: R, index: number, array: R[]) => boolean) => this._toList(predicate, queryableListStore),
        firstOrDefault: (predicate?: (value: R, index: number, array: R[]) => boolean) =>
          this._firstOrDefault(predicate, queryableListStore),
        first: (predicate?: (value: R, index: number, array: R[]) => boolean) => this._first(predicate, queryableListStore),
        any: (predicate?: (value: R, index: number, array: R[]) => boolean) => this._any(predicate, queryableListStore),
        toList$: (predicate?: (value: R, index: number, array: R[]) => boolean) => this._toList$(predicate, queryableListStore),
        firstOrDefault$: (predicate?: (value: R, index: number, array: R[]) => boolean) =>
          this._firstOrDefault$(predicate, queryableListStore)
      }
    }
    if (this._isQLSE<T>(queryableListStore) && pipeOrActions) {
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
  protected _setCompare<R>(
    compare: Compare,
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>
  ): ChainableListStoreQuery<R> {
    if (!queryableListStore) queryableListStore = this._getQueryableListStore()
    if (this._isQLSE(queryableListStore)) queryableListStore._compare = compare
    return queryableListStore
  }

  public setCompare(compare: Compare): ChainableListStoreQuery<S> {
    return this._setCompare(compare)
  }

  /** @internal */
  protected _when<R>(
    actionOrActions: Actions | string | (Actions | string)[],
    queryableListStore?: ChainableListStoreQuery<R>
  ): ChainableListStoreQuery<R> {
    return this._getQueryableListStore(isArray(actionOrActions) ? actionOrActions : [actionOrActions], queryableListStore)
  }

  public when(action: Actions | string): ChainableListStoreQuery<S>
  public when(actions: (Actions | string)[]): ChainableListStoreQuery<S>
  public when(actionOrActions: Actions | string | (Actions | string)[]): ChainableListStoreQuery<S>
  public when(actionOrActions: Actions | string | (Actions | string)[]): ChainableListStoreQuery<S> {
    return this._when(actionOrActions)
  }

  /** @internal */
  protected _select<T, R>(
    projectsOrKeys: ProjectsOrKeys<T, R>,
    queryableListStore?: ChainableListStoreQuery<R>
  ): ChainableListStoreQuery<R> {
    const project: Project<T, R> = this._getProjectionMethod(projectsOrKeys)
    const mapper: Pipe<T[], R[]> = (arr: T[]) => arr.map(project) as R[]
    return this._getQueryableListStore<T, R>(mapper, queryableListStore)
  }

  public select<R>(project: (value: Readonly<S>) => NoVoid<R>): ChainableListStoreQuery<R>
  public select<R extends ReturnType<U>[], U extends (value: Readonly<S>) => NoVoid<any>>(projects: U[]): ChainableListStoreQuery<R>
  public select<R extends any[]>(projects: ((value: Readonly<S>) => NoVoid<any>)[]): ChainableListStoreQuery<R>
  public select<R, K extends keyof S>(key: K): ChainableListStoreQuery<R>
  public select<R, K extends keyof S>(keys: K[]): ChainableListStoreQuery<R>
  public select<R>(dynamic: ProjectsOrKeys<S, R>): ChainableListStoreQuery<R>
  public select<R>(projectsOrKeys: ProjectsOrKeys<S, R>): ChainableListStoreQuery<R> {
    return this._select<S, R>(projectsOrKeys)
  }

  /** @internal */
  protected _where<T>(
    predicate: (value: T, index: number, array: T[]) => boolean,
    queryableListStore?: ChainableListStoreQuery<T>
  ): ChainableListStoreQuery<T> {
    const filter: Pipe<T[], T[] | T> = (arr: T[]) => arr.filter(predicate)
    return this._getQueryableListStore(filter, queryableListStore)
  }

  public where(predicate: (value: S, index: number, array: S[]) => boolean): ChainableListStoreQuery<S> {
    return this._where(predicate)
  }

  /** @internal */
  protected _orderBy<R>(
    partialSortOptions?: true | false | KeyOrNever<R> | SortOptions<R> | SortOptions<R>[],
    token?: SortingAlgorithmToken,
    queryableListStore?: ChainableListStoreQuery<R>
  ): ChainableListStoreQuery<R> {
    const sortingApi: SortMethodApi<R> = SortFactory.create(partialSortOptions)
    if (token) sortingApi.setSortingAlgorithm(token)
    return this._getQueryableListStore(sortingApi, queryableListStore)
  }

  public orderBy(desc?: false, token?: SortingAlgorithmToken): ChainableListStoreQuery<S>
  public orderBy(desc: true, token?: SortingAlgorithmToken): ChainableListStoreQuery<S>
  public orderBy(key: KeyOrNever<S>, token?: SortingAlgorithmToken): ChainableListStoreQuery<S>
  public orderBy(sortOptions: SortOptions<S>, token?: SortingAlgorithmToken): ChainableListStoreQuery<S>
  public orderBy(sortOptions: SortOptions<S>[], token?: SortingAlgorithmToken): ChainableListStoreQuery<S>
  public orderBy(
    dynamic?: true | false | KeyOrNever<S> | SortOptions<S> | SortOptions<S>[],
    token?: SortingAlgorithmToken
  ): ChainableListStoreQuery<S>
  public orderBy(
    partialSortOptions?: true | false | KeyOrNever<S> | SortOptions<S> | SortOptions<S>[],
    token?: SortingAlgorithmToken
  ): ChainableListStoreQuery<S> {
    return this._orderBy(partialSortOptions, token)
  }

  /** @internal */
  protected _toList<T, R>(
    predicate?: ((value: T | R, index: number, array: T[] | R[]) => boolean),
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): R[] {
    if (predicate) queryableListStore = this._where<R>(predicate, queryableListStore)
    let value: S[] | R[] | null = this._value ? [...this._value] : null
    assert(value, `Store: "${this._storeName}" has tried to access state's value before initialization.`)
    if (queryableListStore && this._isQLSE<R>(queryableListStore)) {
      value = queryableListStore._pipe(value, queryableListStore._pipMethods)
    }
    return this._clone(value) as R[]
  }

  public toList(): S[]
  public toList<R>(): R[]
  public toList(predicate: (value: S, index: number, array: S[]) => boolean): S[]
  public toList<R>(predicate: (value: S, index: number, array: S[]) => boolean): R[]
  public toList<R>(predicate?: (value: S | R, index: number, array: S[] | R[]) => boolean): S[] | R[] {
    return this._toList<S, R>(predicate)
  }

  /** @internal */
  protected _firstOrDefault<T, R>(
    predicate?: (value: T | R, index: number, array: T[] | R[]) => boolean,
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): R | null {
    let value: S[] | R[] | null = this._value ? [...this._value] : null
    if (isNull(value)) return value
    if (queryableListStore && this._isQLSE<R>(queryableListStore)) {
      value = queryableListStore._pipe(value, queryableListStore._pipMethods)
    }
    let result: T | R | null = null
    if (predicate) {
      result = (value as R[]).find(predicate) ?? null
    } else if (value[0]) {
      result = value[0] as R
    }
    return isObject(result) ? this._clone(result) : null
  }

  public firstOrDefault(): S | null
  public firstOrDefault<R>(): R | null
  public firstOrDefault(predicate: (value: S, index: number, array: S[]) => boolean): S | null
  public firstOrDefault<R>(predicate: (value: R, index: number, array: R[]) => boolean): R | null
  public firstOrDefault<R>(predicate?: (value: S | R, index: number, array: S[] | R[]) => boolean): S | R | null {
    return this._firstOrDefault<S, R>(predicate)
  }

  /** @internal */
  protected _first<R>(
    predicate?: (value: R, index: number, array: R[]) => boolean,
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): R | never {
    const result: R | null = this._firstOrDefault(predicate, queryableListStore)
    return isEmpty(result) ? throwError(`Store: "${this._storeName}" has resolved a null value by first method.`) : result
  }

  public first(): S | never
  public first<R>(): R | never
  public first(predicate: (value: S, index: number, array: S[]) => boolean): S | never
  public first<R>(predicate: (value: R, index: number, array: R[]) => boolean): R | never
  public first<R>(predicate?: (value: S | R, index: number, array: S[] | R[]) => boolean): S | R | never {
    return this._first(predicate)
  }

  /** @internal */
  protected _any<R>(
    predicate?: (value: R, index: number, array: R[]) => boolean,
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): boolean {
    const result: R | null = this._firstOrDefault(predicate, queryableListStore)
    return !isNull(result)
  }

  public any(): boolean
  public any<R>(): boolean
  public any(predicate: (value: S, index: number, array: S[]) => boolean): boolean
  public any<R>(predicate: (value: R, index: number, array: R[]) => boolean): boolean
  public any<R>(predicate?: (value: S | R, index: number, array: S[] | R[]) => boolean): boolean {
    return this._any(predicate)
  }

  /** @internal */
  protected _getObs$<T>(queryableListStore?: ChainableListStoreQuery<any> | ChainableListStoreQueryExtended<any, S>): Observable<T> {
    if (queryableListStore && this._isQLSE(queryableListStore)) {
      return this._get$({
        actionOrActions: queryableListStore._actions,
        pipe: this._createPipe(queryableListStore),
        compare: queryableListStore._compare
      }) as Observable<T>
    }
    return this._get$({}) as Observable<T>
  }

  /** @internal */
  protected _toList$<T, R>(
    predicate?: ((value: T | R, index: number, array: T[] | R[]) => boolean),
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): Observable<T[] | R[]> {
    if (predicate) queryableListStore = this._where<R>(predicate, queryableListStore)
    return this._getObs$<T[] | R[]>(queryableListStore)
  }

  public toList$(): Observable<S[]>
  public toList$<R>(): Observable<R[]>
  public toList$(predicate: (value: S, index: number, array: S[]) => boolean): Observable<S[]>
  public toList$<R>(predicate: (value: S, index: number, array: S[]) => boolean): Observable<R[]>
  public toList$<R>(predicate?: (value: S | R, index: number, array: S[] | R[]) => boolean): Observable<S[] | R[]> {
    return this._toList$<S, R>(predicate)
  }

  /** @internal */
  protected _firstOrDefault$<T, R extends T | any>(
    predicate?: (value: T, index: number, array: T[]) => boolean,
    queryableListStore?: ChainableListStoreQuery<T | R> | ChainableListStoreQueryExtended<T | R, S>,
  ): Observable<T | R | null> {
    const find: Pipe<T[], T | null> = predicate ?
      ((arr: T[]) => arr.find(predicate) || null) :
      ((arr: T[]) => arr.length ? arr[0] : null)
    queryableListStore = this._getQueryableListStore<T, T | R | null>(find, queryableListStore) as ChainableListStoreQuery<T | R>
    return this._getObs$<T | R | null>(queryableListStore)
  }

  public firstOrDefault$(): Observable<S | null>
  public firstOrDefault$<R>(): Observable<R | null>
  public firstOrDefault$(predicate: (value: S, index: number, array: S[]) => boolean): Observable<S | null>
  public firstOrDefault$<R>(predicate: (value: R, index: number, array: R[]) => boolean): Observable<R | null>
  public firstOrDefault$<R>(predicate?: (value: S | R, index: number, array: S[] | R[]) => boolean): Observable<S | R | null> {
    return this._firstOrDefault$<S, R>(predicate)
  }

  //#endregion query-methods
}
