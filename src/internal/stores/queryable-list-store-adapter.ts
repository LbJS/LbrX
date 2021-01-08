import { iif, MonoTypeOperatorFunction, Observable, of, throwError as rxjsThrowError } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { SortFactory, SortingAlgorithmToken, SortMethodApi, SortOptions } from '../core'
import { assert, isArray, isEmpty, isNull, isObject, throwError } from '../helpers'
import { KeyOrNever, NoVoid } from '../types'
import { BaseStore } from './base-store'
import { ListStoreConfigOptions } from './config'
import { Actions, ChainableListStoreQuery, ChainableListStoreQueryExtended, Compare, Pipe, Predicate, Project, ProjectsOrKeys } from './store-accessories'

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
    return (value: readonly S[]) => queryableListStore._pipe(value, queryableListStore._pipMethods)
  }

  //#region helper-methods
  //#region query-methods

  /** @internal */
  protected _getQueryableListStore<T, R>(
    pipeOrActions?: Pipe<readonly T[], readonly R[] | Readonly<R>> | (Actions | string)[],
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): ChainableListStoreQuery<R> {
    if (!queryableListStore) {
      queryableListStore = {
        _actions: null,
        _pipMethods: [],
        _compare: null,
        _pipe: <B>(arr: readonly S[], pipeMethods: Pipe<any[], any[] | any>[]): readonly B[] | readonly S[] => {
          let result: any = arr
          pipeMethods.forEach(pipe => {
            result = pipe(result)
          })
          return result
        },
        setCompare: (compare: Compare) => this._setCompare(compare, queryableListStore),
        when: (actionOrActions: Actions | string | (Actions | string)[]) => this._when(actionOrActions, queryableListStore),
        select: (projectsOrKeys: ProjectsOrKeys<R, any>) => this._select(projectsOrKeys, queryableListStore),
        where: (predicate: Predicate<R>) => this._where(predicate, queryableListStore),
        orderBy: (partialSortOptions?: true | false | KeyOrNever<R> | SortOptions<Readonly<R>> | SortOptions<Readonly<R>>[],
          token?: SortingAlgorithmToken) => this._orderBy(partialSortOptions, token, queryableListStore),
        toList: (predicate?: Predicate<R>) => this._toList(predicate, queryableListStore),
        firstOrDefault: (predicate?: Predicate<R>) => this._firstOrDefault(predicate, queryableListStore),
        first: (predicate?: Predicate<R>) => this._first(predicate, queryableListStore),
        any: (predicate?: Predicate<R>) => this._any(predicate, queryableListStore),
        toList$: (predicate?: Predicate<R>) => this._toList$(predicate, queryableListStore),
        firstOrDefault$: (predicate?: Predicate<R>) => this._firstOrDefault$(predicate, queryableListStore),
        first$: (predicate?: Predicate<R>) => this._first$(predicate, queryableListStore),
        any$: (predicate?: Predicate<R>) => this._any$(predicate, queryableListStore),
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
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, Readonly<S>>
  ): ChainableListStoreQuery<Readonly<R>> {
    if (!queryableListStore) queryableListStore = this._getQueryableListStore()
    if (this._isQLSE(queryableListStore)) queryableListStore._compare = compare
    return queryableListStore
  }

  public setCompare(compare: Compare): ChainableListStoreQuery<Readonly<S>> {
    return this._setCompare(compare)
  }

  /** @internal */
  protected _when<R>(
    actionOrActions: Actions | string | (Actions | string)[],
    queryableListStore?: ChainableListStoreQuery<R>
  ): ChainableListStoreQuery<R> {
    return this._getQueryableListStore(isArray(actionOrActions) ? actionOrActions : [actionOrActions], queryableListStore)
  }

  public when(action: Actions | string): ChainableListStoreQuery<Readonly<S>>
  public when(actions: (Actions | string)[]): ChainableListStoreQuery<Readonly<S>>
  public when(actionOrActions: Actions | string | (Actions | string)[]): ChainableListStoreQuery<Readonly<S>>
  public when(actionOrActions: Actions | string | (Actions | string)[]): ChainableListStoreQuery<Readonly<S>> {
    return this._when(actionOrActions)
  }

  /** @internal */
  protected _select<T, R>(
    projectsOrKeys: ProjectsOrKeys<T, R>,
    queryableListStore?: ChainableListStoreQuery<Readonly<R>>
  ): ChainableListStoreQuery<Readonly<R>> {
    const project: Project<T, R> = this._getProjectionMethod(projectsOrKeys)
    const mapper: Pipe<readonly T[], readonly R[]> = (arr: readonly T[]) => arr.map(project) as readonly R[]
    return this._getQueryableListStore<Readonly<T>, Readonly<R>>(mapper, queryableListStore)
  }

  public select<R>(project: (value: Readonly<S>) => NoVoid<R>): ChainableListStoreQuery<Readonly<R>>
  public select<R extends ReturnType<U>[], U extends (value: Readonly<S>) => NoVoid<any>>(projects: U[]
  ): ChainableListStoreQuery<Readonly<R>>
  public select<R extends any[]>(projects: ((value: Readonly<S>) => NoVoid<any>)[]): ChainableListStoreQuery<Readonly<R>>
  public select<R, K extends keyof S>(key: K): ChainableListStoreQuery<Readonly<R>>
  public select<R, K extends keyof S>(keys: K[]): ChainableListStoreQuery<Readonly<R>>
  public select<R>(dynamic: ProjectsOrKeys<S, R>): ChainableListStoreQuery<Readonly<R>>
  public select<R>(projectsOrKeys: ProjectsOrKeys<S, R>): ChainableListStoreQuery<Readonly<R>> {
    return this._select<Readonly<S>, Readonly<R>>(projectsOrKeys)
  }

  /** @internal */
  protected _where<T>(
    predicate: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<T>
  ): ChainableListStoreQuery<T> {
    const filter: Pipe<readonly T[], readonly T[]> = (arr: readonly T[]) => arr.filter(predicate)
    return this._getQueryableListStore(filter, queryableListStore)
  }

  public where(predicate: Predicate<S>): ChainableListStoreQuery<S> {
    return this._where(predicate)
  }

  /** @internal */
  protected _orderBy<R>(
    partialSortOptions?: true | false | KeyOrNever<R> | SortOptions<Readonly<R>> | SortOptions<Readonly<R>>[],
    token?: SortingAlgorithmToken,
    queryableListStore?: ChainableListStoreQuery<Readonly<R>>
  ): ChainableListStoreQuery<Readonly<R>> {
    const sortingApi: SortMethodApi<R> = SortFactory.create(partialSortOptions)
    if (token) sortingApi.setSortingAlgorithm(token)
    const sort: Pipe<readonly R[], readonly R[]> = (arr: readonly R[]) => {
      const result = sortingApi([...arr])
      return this._freezeHandler(result, true)
    }
    return this._getQueryableListStore(sort, queryableListStore)
  }

  public orderBy(desc?: false, token?: SortingAlgorithmToken): ChainableListStoreQuery<Readonly<S>>
  public orderBy(desc: true, token?: SortingAlgorithmToken): ChainableListStoreQuery<Readonly<S>>
  public orderBy(key: KeyOrNever<S>, token?: SortingAlgorithmToken): ChainableListStoreQuery<Readonly<S>>
  public orderBy(sortOptions: SortOptions<Readonly<S>>, token?: SortingAlgorithmToken): ChainableListStoreQuery<Readonly<S>>
  public orderBy(sortOptions: SortOptions<Readonly<S>>[], token?: SortingAlgorithmToken): ChainableListStoreQuery<Readonly<S>>
  public orderBy(
    dynamic?: true | false | KeyOrNever<S> | SortOptions<Readonly<S>> | SortOptions<Readonly<S>>[],
    token?: SortingAlgorithmToken
  ): ChainableListStoreQuery<Readonly<S>>
  public orderBy(
    partialSortOptions?: true | false | KeyOrNever<S> | SortOptions<Readonly<S>> | SortOptions<Readonly<S>>[],
    token?: SortingAlgorithmToken
  ): ChainableListStoreQuery<Readonly<S>> {
    return this._orderBy(partialSortOptions, token)
  }

  /** @internal */
  protected _toList<T, R>(
    predicate?: (Predicate<T, R>),
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): R[] {
    if (predicate) queryableListStore = this._where<R>(predicate, queryableListStore)
    let value: S[] | R[] | readonly R[] | readonly S[] | null = this._value
    assert(value, `Store: "${this._storeName}" has tried to access state's value before initialization.`)
    if (queryableListStore && this._isQLSE(queryableListStore)) {
      value = queryableListStore._pipe(value, queryableListStore._pipMethods) as readonly R[]
    }
    return this._clone(value) as R[]
  }

  public toList(): S[]
  public toList<R>(): R[]
  public toList(predicate: Predicate<S>): S[]
  public toList<R>(predicate: Predicate<S>): R[]
  public toList<R>(predicate?: Predicate<S, R>
  ): S[] | R[] {
    return this._toList<S, R>(predicate)
  }

  /** @internal */
  protected _firstOrDefault<T, R>(
    predicate?: Predicate<T, R>,
    queryableListStore?: ChainableListStoreQuery<Readonly<R>> | ChainableListStoreQueryExtended<R, S>,
  ): R | null {
    let value: S[] | R[] | readonly R[] | readonly S[] | null = this._value
    if (isNull(value)) return value
    if (queryableListStore && this._isQLSE<R>(queryableListStore)) {
      value = queryableListStore._pipe(value, queryableListStore._pipMethods) as readonly R[]
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
  public firstOrDefault(predicate: Predicate<S>): S | null
  public firstOrDefault<R>(predicate: Predicate<R>): R | null
  public firstOrDefault<R>(predicate?: Predicate<S, R>
  ): S | R | null {
    return this._firstOrDefault<S, R>(predicate)
  }

  /** @internal */
  protected _first<R>(
    predicate?: Predicate<R>,
    queryableListStore?: ChainableListStoreQuery<Readonly<R>> | ChainableListStoreQueryExtended<R, S>,
  ): R | never {
    const result: R | null = this._firstOrDefault(predicate, queryableListStore)
    return isEmpty(result) ? throwError(`Store: "${this._storeName}" has resolved a null value by first method.`) : result
  }

  public first(): S | never
  public first<R>(): R | never
  public first(predicate: Predicate<S>): S | never
  public first<R>(predicate: Predicate<R>): R | never
  public first<R>(predicate?: Predicate<S, R>
  ): S | R | never {
    return this._first(predicate)
  }

  /** @internal */
  protected _any<R>(
    predicate?: Predicate<R>,
    queryableListStore?: ChainableListStoreQuery<Readonly<R>> | ChainableListStoreQueryExtended<R, S>,
  ): boolean {
    const result: R | null = this._firstOrDefault(predicate, queryableListStore)
    return !isNull(result)
  }

  public any(): boolean
  public any<R>(): boolean
  public any(predicate: Predicate<S>): boolean
  public any<R>(predicate: Predicate<R>): boolean
  public any<R>(predicate?: Predicate<S, R>): boolean {
    return this._any(predicate)
  }

  /** @internal */
  protected _getObs$<T>(
    queryableListStore?: ChainableListStoreQuery<any> | ChainableListStoreQueryExtended<any, S>,
    operators?: MonoTypeOperatorFunction<any>[]
  ): Observable<T> {
    if (queryableListStore && this._isQLSE(queryableListStore)) {
      return this._get$({
        actionOrActions: queryableListStore._actions,
        pipe: this._createPipe(queryableListStore),
        compare: queryableListStore._compare,
        operators
      }) as Observable<T>
    }
    return this._get$({}) as Observable<T>
  }

  /** @internal */
  protected _toList$<T, R>(
    predicate?: Predicate<T, R>,
    queryableListStore?: ChainableListStoreQuery<Readonly<R>> | ChainableListStoreQueryExtended<R, S>,
  ): Observable<T[] | R[]> {
    if (predicate) queryableListStore = this._where<R>(predicate, queryableListStore)
    return this._getObs$<T[] | R[]>(queryableListStore)
  }

  public toList$(): Observable<S[]>
  public toList$<R>(): Observable<R[]>
  public toList$(predicate: Predicate<S>): Observable<S[]>
  public toList$<R>(predicate: Predicate<S>): Observable<R[]>
  public toList$<R>(predicate?: Predicate<S, R>
  ): Observable<S[] | R[]> {
    return this._toList$<S, R>(predicate)
  }

  /** @internal */
  protected _getQueryableListStoreForSingle<T, R extends T | any>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<R>> | ChainableListStoreQueryExtended<T | R, S>,
  ): ChainableListStoreQuery<Readonly<T> | Readonly<R>> {
    const find: Pipe<T[], Readonly<T> | null> = predicate ?
      ((arr: readonly T[]) => arr.find(predicate) || null) :
      ((arr: readonly T[]) => arr.length ? arr[0] : null)
    return this._getQueryableListStore<T, T | R | null>(find, queryableListStore) as ChainableListStoreQuery<Readonly<T> | Readonly<R>>
  }

  /** @internal */
  protected _firstOrDefault$<T, R extends T | any>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<R>> | ChainableListStoreQueryExtended<T | R, S>,
  ): Observable<T | R | null> {
    queryableListStore = this._getQueryableListStoreForSingle<T, R>(predicate, queryableListStore)
    return this._getObs$<T | R | null>(queryableListStore)
  }

  public firstOrDefault$(): Observable<S | null>
  public firstOrDefault$<R>(): Observable<R | null>
  public firstOrDefault$(predicate: Predicate<S>): Observable<S | null>
  public firstOrDefault$<R>(predicate: Predicate<R>): Observable<R | null>
  public firstOrDefault$<R>(predicate?: Predicate<S, R>): Observable<S | R | null> {
    return this._firstOrDefault$<S, R>(predicate)
  }

  /** @internal */
  protected _first$<T, R extends T | any>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<R>> | ChainableListStoreQueryExtended<T | R, S>,
  ): Observable<T | R | never> {
    queryableListStore = this._getQueryableListStoreForSingle<T, R>(predicate, queryableListStore)
    const mergeMapOperator = mergeMap((x: R) => iif(() => isNull(x),
      rxjsThrowError(`Store: "${this._storeName}" has resolved a null value by first$ observable.`),
      of(x)))
    return this._getObs$<T | R | never>(queryableListStore, [mergeMapOperator])
  }

  public first$(): Observable<S | never>
  public first$<R>(): Observable<R | never>
  public first$(predicate: Predicate<S>): Observable<S | never>
  public first$<R>(predicate: Predicate<R>): Observable<R | never>
  public first$<R>(
    predicate?: Predicate<S, R>
  ): Observable<S | R | never> {
    return this._first$<S, R>(predicate)
  }

  /** @internal */
  protected _any$<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | boolean> | ChainableListStoreQueryExtended<T | boolean, S>,
  ): Observable<boolean> {
    const some: Pipe<T[], boolean> = predicate ?
      ((arr: readonly T[]) => arr.some(predicate)) :
      ((arr: readonly T[]) => !!arr.length)
    queryableListStore = this._getQueryableListStore<T, boolean>(some, queryableListStore as ChainableListStoreQuery<boolean>)
    return this._getObs$<boolean>(queryableListStore)
  }

  public any$(): Observable<boolean>
  public any$<R>(): Observable<boolean>
  public any$(predicate: Predicate<S>): Observable<boolean>
  public any$<R>(predicate: Predicate<R>): Observable<boolean>
  public any$<R>(predicate?: Predicate<S, R>
  ): Observable<boolean> {
    return this._any$<S>(predicate)
  }

  //#endregion query-methods
}
