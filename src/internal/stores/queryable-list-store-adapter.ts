import { SortFactory, SortingAlgorithmToken, SortMethodApi, SortOptions } from '../core'
import { assert, isArray, isEmpty, isNull, isObject, throwError } from '../helpers'
import { KeyOrNever, NoVoid } from '../types'
import { BaseStore } from './base-store'
import { ListStoreConfigOptions } from './config'
import { Actions, ChainableListStoreQuery, ChainableListStoreQueryExtended, Pipe, Project, ProjectsOrKeys } from './store-accessories'

export abstract class QueryableListStoreAdapter<S, E = any> extends BaseStore<S[], S, E> implements ChainableListStoreQuery<S> {

  //#region constructor

  constructor(storeConfig?: ListStoreConfigOptions<S>) {
    super(storeConfig)
  }

  //#endregion constructor
  //#region query-methods

  protected _assertIsQLSE<T>(value: any): value is ChainableListStoreQueryExtended<T, S> {
    assert(value._pipMethods, `Store: "${this._config.name}" has encountered an critical error durning piping..`)
    return true
  }

  /** @internal */
  protected _getQueryableListStore<T, R>(
    pipeOrActions: Pipe<T[], R[] | R> | (Actions | string)[],
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): ChainableListStoreQuery<R> {
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
        where: (predicate: (value: R, index: number, array: R[]) => boolean) => this._where(predicate, queryableListStore),
        when: (actionOrActions: Actions | string | (Actions | string)[]) => this._when(actionOrActions, queryableListStore),
        orderBy: (partialSortOptions?: true | false | KeyOrNever<R> | SortOptions<R> | SortOptions<R>[], token?: SortingAlgorithmToken) =>
          this._orderBy(partialSortOptions, token, queryableListStore),
        toList: (predicate?: (value: R, index: number, array: R[]) => boolean) => this._toList(predicate, queryableListStore),
        firstOrDefault: (predicate?: (value: R, index: number, array: R[]) => boolean) =>
          this._firstOrDefault(predicate, queryableListStore),
        first: (predicate?: (value: R, index: number, array: R[]) => boolean) => this._first(predicate, queryableListStore),
        any: (predicate?: (value: R, index: number, array: R[]) => boolean) => this._any(predicate, queryableListStore),
      }
    }
    if (this._assertIsQLSE<T>(queryableListStore)) {
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
  protected _where<R>(
    predicate: (value: R, index: number, array: R[]) => boolean,
    queryableListStore?: ChainableListStoreQuery<R>
  ): ChainableListStoreQuery<R> {
    const filter: Pipe<R[], R[] | R> = (arr: R[]) => arr.filter(predicate)
    return this._getQueryableListStore(filter, queryableListStore)
  }

  public where(predicate: (value: S, index: number, array: S[]) => boolean): ChainableListStoreQuery<S> {
    return this._where(predicate)
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
    if (this._assertIsQLSE<R>(queryableListStore)) {
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
    predicate?: (value: R, index: number, array: R[]) => boolean,
    queryableListStore?: ChainableListStoreQuery<R> | ChainableListStoreQueryExtended<R, S>,
  ): R | null {
    let value: S[] | R[] | null = this._value ? [...this._value] : null
    if (isNull(value)) return value
    if (this._assertIsQLSE<R>(queryableListStore)) {
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

  //#endregion query-methods
}
