import { iif, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { isArray, isFunction, isObject } from '../helpers'
import { BaseStore } from './base-store'
import { StoreConfigOptions } from './config'
import { Actions, QueryScope } from './store-accessories'
import { ProjectsOrKeys, QueryableStore } from './store-accessories/interfaces'

/**
 * @example
 * const createWeatherState: WeatherState = () => {
 *   return {
 *     isRaining: true,
 *     isSunny: false,
 *     precipitation: 7
 *   }
 * }
 *
 * `@`StoreConfig({ // <= decorator
 *   name: 'WEATHER-STORE'
 * })
 * export class WeatherStore extends Store<WeatherState, AppError> {
 *
 *   constructor() {
 *     super(createWeatherState())
 *   }
 * }
 */
export class Store<T extends object, E = any> extends BaseStore<T, E> implements QueryableStore<T> {

  //#region constructor

  /**
   * Synchronous initialization.
   */
  constructor(initialValue: T, storeConfig?: StoreConfigOptions)
  /**
   * Asynchronous or delayed initialization.
   * The store will be set into loading state till initialization.
   */
  constructor(initialValue: null, storeConfig?: StoreConfigOptions)
  /**
   * Dynamic initialization.
   */
  constructor(initialValue: T | null, storeConfig?: StoreConfigOptions)
  constructor(initialValueOrNull: T | null, storeConfig?: StoreConfigOptions) {
    super(storeConfig)
    this._main(initialValueOrNull)
  }

  //#endregion constructor
  //#region query-methods

  public select$(): Observable<T>
  public select$<R>(project: (value: Readonly<T>) => T | R): Observable<R>
  public select$<M extends ((value: Readonly<T>) => any), R extends ReturnType<M>>(projects: M[]): Observable<R[]>
  public select$<R>(projects: ((value: Readonly<T>) => any)[]): Observable<R>
  // public select$<R>(projects: ((value: Readonly<T>) => T | R)[]): Observable<R>
  // public select$<K extends keyof T>(key: K): Observable<T[K]>
  // public select$<R = unknown>(key: string): Observable<R>
  // public select$<K extends keyof T>(key: K[]): Observable<Pick<T, K>>
  // public select$<K extends keyof T>(key: K[], returnAsArray?: boolean)
  //   : typeof returnAsArray extends true ? Observable<(T[K])[]> : Observable<Pick<T, K>>
  // public select$<R extends object = object>(key: string[]): Observable<R>
  // public select$<R extends object = object>(key: string[], returnAsArray?: boolean)
  //   : typeof returnAsArray extends true ? Observable<unknown[]> : Observable<R>
  public select$<R>(dynamic?: ProjectsOrKeys<T, R>): Observable<T | R | R[]>
  public select$<R>(projectsOrKeys?: ProjectsOrKeys<T, R>): Observable<T | R | R[]> {
    return this._select$<R>()(projectsOrKeys || [] as any)
  }

  public onAction(action: Actions | string): QueryableStore<T> {
    return { select$: this._select$<any>(action) }
  }

  protected _select$<R>(action?: Actions | string): (projectsOrKeys?: ProjectsOrKeys<T, R>) => Observable<T | R | R[]> {
    return (projectsOrKeys?: ProjectsOrKeys<T, R>) => {
      const tillLoaded$ = this._isLoading$.asObservable()
        .pipe(
          filter(x => !x),
          distinctUntilChanged(),
          switchMap(() => this._value$),
        )
      const mapPredicate: (value: Readonly<T>) => T | R | any[] = (() => {
        if (isArray(projectsOrKeys)) {
          if (isFunction(projectsOrKeys[0])) return (value: Readonly<T>) => projectsOrKeys.map(x => x(value))
        }
        if (isFunction(projectsOrKeys)) return projectsOrKeys
        return (x: Readonly<T>) => x
      })()
      const filterPredicate = (value: Readonly<T> | null): value is Readonly<T> => !!value
      const queryScope: QueryScope = {
        wasHardReset: false,
        isDisposed: false,
        observable: this._value$.asObservable()
          .pipe(
            mergeMap(x => iif(() => this.isLoading && action != Actions.loading, tillLoaded$, of(x))),
            filter(() => !this.isPaused && !queryScope.isDisposed && (!action || action === this._lastAction)),
            filter(filterPredicate),
            map(mapPredicate),
            distinctUntilChanged((prev, curr) => {
              if (queryScope.wasHardReset) return false
              return (isObject(prev) && isObject(curr)) ? this._compare(prev, curr) : prev === curr
            }),
            tap(() => queryScope.wasHardReset = false),
            map(x => isObject(x) ? this._clone(x) : x),
          )
      }
      this._queryScopes.push(queryScope)
      return queryScope.observable
    }
  }

  //#endregion query-methods
}
