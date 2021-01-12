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
        count: (predicate?: Predicate<R>) => this._count(predicate, queryableListStore),
        firstOrDefault: (predicate?: Predicate<R>) => this._firstOrDefault(predicate, queryableListStore),
        first: (predicate?: Predicate<R>) => this._first(predicate, queryableListStore),
        lastOrDefault: (predicate?: Predicate<R>) => this._lastOrDefault(predicate, queryableListStore),
        last: (predicate?: Predicate<R>) => this._last(predicate, queryableListStore),
        any: (predicate?: Predicate<R>) => this._any(predicate, queryableListStore),
        toList$: (predicate?: Predicate<R>) => this._toList$(predicate, queryableListStore),
        count$: (predicate?: Predicate<R>) => this._count$(predicate, queryableListStore),
        firstOrDefault$: (predicate?: Predicate<R>) => this._firstOrDefault$(predicate, queryableListStore),
        first$: (predicate?: Predicate<R>) => this._first$(predicate, queryableListStore),
        lastOrDefault$: (predicate?: Predicate<R>) => this._lastOrDefault$(predicate, queryableListStore),
        last$: (predicate?: Predicate<R>) => this._last$(predicate, queryableListStore),
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
  protected _setCompare<T>(
    compare: Compare,
    queryableListStore?: ChainableListStoreQuery<T> | ChainableListStoreQueryExtended<T, Readonly<S>>
  ): ChainableListStoreQuery<Readonly<T>> {
    if (!queryableListStore) queryableListStore = this._getQueryableListStore()
    if (this._isQLSE(queryableListStore)) queryableListStore._compare = compare
    return queryableListStore
  }

  public setCompare(compare: Compare): ChainableListStoreQuery<Readonly<S>> {
    return this._setCompare(compare)
  }

  /** @internal */
  protected _when<T>(
    actionOrActions: Actions | string | (Actions | string)[],
    queryableListStore?: ChainableListStoreQuery<T>
  ): ChainableListStoreQuery<T> {
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
  protected _orderBy<T>(
    partialSortOptions?: true | false | KeyOrNever<T> | SortOptions<Readonly<T>> | SortOptions<Readonly<T>>[],
    token?: SortingAlgorithmToken,
    queryableListStore?: ChainableListStoreQuery<Readonly<T>>
  ): ChainableListStoreQuery<Readonly<T>> {
    const sortingApi: SortMethodApi<T> = SortFactory.create(partialSortOptions)
    if (token) sortingApi.setSortingAlgorithm(token)
    const sort: Pipe<readonly T[], readonly T[]> = (arr: readonly T[]) => {
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
  protected _toList<T>(
    predicate?: (Predicate<T>),
    queryableListStore?: ChainableListStoreQuery<T> | ChainableListStoreQueryExtended<T, S>,
  ): T[] {
    if (predicate) queryableListStore = this._where<T>(predicate, queryableListStore)
    let value: S[] | T[] | readonly T[] | readonly S[] | null = this._value
    assert(value, `Store: "${this._storeName}" has tried to access state's value before initialization.`)
    if (queryableListStore && this._isQLSE(queryableListStore)) {
      value = queryableListStore._pipe(value, queryableListStore._pipMethods) as readonly T[]
    }
    return this._clone(value) as T[]
  }

  public toList(): S[]
  public toList(predicate: Predicate<S>): S[]
  public toList(predicate?: Predicate<S>): S[] {
    return this._toList(predicate)
  }

  /** @internal */
  protected _count<T>(
    predicate?: (Predicate<T>),
    queryableListStore?: ChainableListStoreQuery<T> | ChainableListStoreQueryExtended<T, S>,
  ): number {
    if (predicate) queryableListStore = this._where<T>(predicate, queryableListStore)
    let value: S[] | T[] | readonly T[] | readonly S[] | null = this._value
    assert(value, `Store: "${this._storeName}" has tried to access state's value before initialization.`)
    if (queryableListStore && this._isQLSE(queryableListStore)) {
      value = queryableListStore._pipe(value, queryableListStore._pipMethods) as readonly T[]
    }
    return value.length
  }

  public count(): number
  public count(predicate: Predicate<S>): number
  public count(predicate?: Predicate<S>): number {
    return this._count(predicate)
  }

  /** @internal */
  protected _firstOrDefault<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): T | null {
    let value: S[] | T[] | readonly T[] | readonly S[] | null = this._value
    if (isNull(value)) return value
    if (queryableListStore && this._isQLSE<T>(queryableListStore)) {
      value = queryableListStore._pipe(value, queryableListStore._pipMethods) as readonly T[]
    }
    let result: T | null = null
    if (predicate) {
      result = (value as T[]).find(predicate) ?? null
    } else if (value[0]) {
      result = value[0] as T
    }
    return isObject(result) ? this._clone(result) : null
  }

  public firstOrDefault(): S | null
  public firstOrDefault(predicate: Predicate<S>): S | null
  public firstOrDefault(predicate?: Predicate<S>
  ): S | null {
    return this._firstOrDefault(predicate)
  }

  /** @internal */
  protected _lastOrDefault<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): T | null {
    let value: S[] | T[] | readonly T[] | readonly S[] | null = this._value
    if (isNull(value)) return value
    if (queryableListStore && this._isQLSE<T>(queryableListStore)) {
      value = queryableListStore._pipe(value, queryableListStore._pipMethods) as readonly T[]
    }
    let result: T | null = null
    if (predicate) value = (value as T[]).filter(predicate) ?? null
    if (value.length) result = value[value.length - 1] as T
    return isObject(result) ? this._clone(result) : null
  }

  public lastOrDefault(): S | null
  public lastOrDefault(predicate: Predicate<S>): S | null
  public lastOrDefault(predicate?: Predicate<S>
  ): S | null {
    return this._lastOrDefault(predicate)
  }

  /** @internal */
  protected _first<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): T | never {
    const result: T | null = this._firstOrDefault(predicate, queryableListStore)
    return isEmpty(result) ? throwError(`Store: "${this._storeName}" has resolved a null value by first method.`) : result
  }

  public first(): S | never
  public first(predicate: Predicate<S>): S | never
  public first(predicate?: Predicate<S>
  ): S | never {
    return this._first(predicate)
  }

  /** @internal */
  protected _last<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): T | never {
    const result: T | null = this._lastOrDefault(predicate, queryableListStore)
    return isEmpty(result) ? throwError(`Store: "${this._storeName}" has resolved a null value by last method.`) : result
  }

  public last(): S | never
  public last(predicate: Predicate<S>): S | never
  public last(predicate?: Predicate<S>
  ): S | never {
    return this._last(predicate)
  }

  /** @internal */
  protected _any<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): boolean {
    const result: T | null = this._firstOrDefault(predicate, queryableListStore)
    return !isNull(result)
  }

  public any(): boolean
  public any(predicate: Predicate<S>): boolean
  public any(predicate?: Predicate<S>): boolean {
    return this._any(predicate)
  }

  /** @internal */
  protected _getObs$<T>(
    queryableListStore?: ChainableListStoreQuery<any> | ChainableListStoreQueryExtended<any, S>,
    operators?: MonoTypeOperatorFunction<any>[]
  ): Observable<T> {
    if (queryableListStore && this._isQLSE(queryableListStore)) {
      return this._get$({
        onActionOrActions: queryableListStore._actions,
        pipe: this._createPipe(queryableListStore),
        compare: queryableListStore._compare,
        operators
      })
    }
    return this._get$({})
  }

  /** @internal */
  protected _toList$<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): Observable<T[]> {
    if (predicate) queryableListStore = this._where<T>(predicate, queryableListStore)
    return this._getObs$<T[]>(queryableListStore)
  }

  public toList$(): Observable<S[]>
  public toList$(predicate: Predicate<S>): Observable<S[]>
  public toList$(predicate?: Predicate<S>): Observable<S[]> {
    return this._toList$(predicate)
  }

  /** @internal */
  protected _count$<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | number> | ChainableListStoreQueryExtended<T | number, S>,
  ): Observable<number> {
    if (predicate) queryableListStore = this._where<T>(predicate, queryableListStore as ChainableListStoreQuery<Readonly<T>>)
    const count: Pipe<T[], number> = (value: readonly T[]) => value.length
    queryableListStore = this._getQueryableListStore<T, number>(count, queryableListStore as ChainableListStoreQuery<number>)
    return this._getObs$<number>(queryableListStore)
  }

  public count$(): Observable<number>
  public count$(predicate: Predicate<S>): Observable<number>
  public count$(predicate?: Predicate<S>): Observable<number> {
    return this._count$(predicate)
  }

  /** @internal */
  protected _getQueryableListStoreForSingle<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): ChainableListStoreQuery<Readonly<T> | Readonly<T>> {
    const find: Pipe<T[], Readonly<T> | null> = predicate ?
      ((arr: readonly T[]) => arr.find(predicate) || null) :
      ((arr: readonly T[]) => arr.length ? arr[0] : null)
    return this._getQueryableListStore<T, T | null>(find, queryableListStore) as ChainableListStoreQuery<Readonly<T> | Readonly<T>>
  }

  /** @internal */
  protected _firstOrDefault$<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): Observable<T | null> {
    queryableListStore = this._getQueryableListStoreForSingle<T>(predicate, queryableListStore)
    return this._getObs$<T | null>(queryableListStore)
  }

  public firstOrDefault$(): Observable<S | null>
  public firstOrDefault$(predicate: Predicate<S>): Observable<S | null>
  public firstOrDefault$(predicate?: Predicate<S>): Observable<S | null> {
    return this._firstOrDefault$(predicate)
  }

  /** @internal */
  protected _first$<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): Observable<T | never> {
    queryableListStore = this._getQueryableListStoreForSingle<T>(predicate, queryableListStore)
    const mergeMapOperator = mergeMap((x: T) => iif(() => isNull(x),
      rxjsThrowError(`Store: "${this._storeName}" has resolved a null value by first$ observable.`),
      of(x)))
    return this._getObs$<T | never>(queryableListStore, [mergeMapOperator])
  }

  public first$(): Observable<S | never>
  public first$(predicate: Predicate<S>): Observable<S | never>
  public first$(predicate?: Predicate<S>): Observable<S | never> {
    return this._first$(predicate)
  }

  /** @internal */
  protected _getQueryableListStoreForLastSingle<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): ChainableListStoreQuery<Readonly<T> | Readonly<T>> {
    const find: Pipe<T[], Readonly<T> | null> = (arr: readonly T[]) => {
      if (predicate) arr = arr.filter(predicate)
      return arr.length ? arr[arr.length - 1] : null
    }
    return this._getQueryableListStore<T, T | null>(find, queryableListStore) as ChainableListStoreQuery<Readonly<T> | Readonly<T>>
  }

  /** @internal */
  protected _lastOrDefault$<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): Observable<T | null> {
    queryableListStore = this._getQueryableListStoreForLastSingle<T>(predicate, queryableListStore)
    return this._getObs$<T | null>(queryableListStore)
  }

  public lastOrDefault$(): Observable<S | null>
  public lastOrDefault$(predicate: Predicate<S>): Observable<S | null>
  public lastOrDefault$(predicate?: Predicate<S>): Observable<S | null> {
    return this._lastOrDefault$(predicate)
  }

  /** @internal */
  protected _last$<T>(
    predicate?: Predicate<T>,
    queryableListStore?: ChainableListStoreQuery<Readonly<T> | Readonly<T>> | ChainableListStoreQueryExtended<T, S>,
  ): Observable<T | never> {
    queryableListStore = this._getQueryableListStoreForLastSingle<T>(predicate, queryableListStore)
    const mergeMapOperator = mergeMap((x: T) => iif(() => isNull(x),
      rxjsThrowError(`Store: "${this._storeName}" has resolved a null value by last$ observable.`),
      of(x)))
    return this._getObs$<T | never>(queryableListStore, [mergeMapOperator])
  }

  public last$(): Observable<S | never>
  public last$(predicate: Predicate<S>): Observable<S | never>
  public last$(predicate?: Predicate<S>): Observable<S | never> {
    return this._last$(predicate)
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
  public any$(predicate: Predicate<S>): Observable<boolean>
  public any$(predicate?: Predicate<S>): Observable<boolean> {
    return this._any$(predicate)
  }

  //#endregion query-methods
}
