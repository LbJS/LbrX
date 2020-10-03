import { iif, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { isArray, isFunction, isObject, isString } from '../helpers'
import { BaseStore } from './base-store'
import { StoreConfigOptions } from './config'
import { Actions, ProjectsOrKeys, QueryableStore, QueryContext } from './store-accessories'

/**
 * @example
 * const createWeatherState: WeatherState = () => {
 *   return {
 *     isRaining: true,
 *     isSunny: false,
 *     precipitation: {
 *       mm: 7
 *     }
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
export class Store<T extends object, E = any> extends BaseStore<T, E> implements QueryableStore<T, E> {

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

  /**
   * Returns the state's value as an Observable.
   * @example
   * weatherStore.select$().subscribe(value => {
   *   // do something with the weather...
   * });
   */
  public select$(): Observable<T>
  /**
   * Returns the extracted partial state's value as an Observable based on the provided projection method.
   * @example
   * weatherStore.select$(value => value.isRaining)
   *   .subscribe(isRaining => {
   *     if (isRaining) {
   *        // do something when it's raining...
   *     }
   *  });
   */
  public select$<R>(project: (value: Readonly<T>) => R): Observable<R>
  /**
   * Returns an array values as an Observable based on the provided projections methods.
   * @example
   * weatherStore.select$([value => value.isRaining, value => value.precipitation])
   *   .subscribe(result => {
   *     const [isRaining, precipitation] = result
   *     // do something...
   *  });
   */
  public select$<R extends ReturnType<M>, M extends ((value: Readonly<T>) => any)>(projects: M[]): Observable<R[]>
  /**
   * Returns an array values as an Observable based on the provided projections methods.
   * - This overload allows to manually define the return type.
   * @example
   * weatherStore.select$([value => value.isRaining, value => value.precipitation])
   *   .subscribe(result => {
   *     const [isRaining, precipitation] = result
   *     // do something...
   *  });
   */
  public select$<R>(projects: ((value: Readonly<T>) => any)[]): Observable<R[]>
  /**
   * Returns as single the state's value property based on the provided key.
   * @example
   * weatherStore.select$('precipitation')
   *   .subscribe(precipitation => {
   *     // do something...
   *  });
   */
  public select$<K extends keyof T>(key: K): Observable<T[K]>
  /**
   * Returns the extracted partial state's value as an Observable based on the provided keys.
   * @example
   * weatherStore.select$(['precipitation', 'isRaining'])
   *   .subscribe(result => {
   *      if (result.isRaining && result.precipitation.mm > 10) {
   *        // do something...
   *      }
   *  });
   */
  public select$<K extends keyof T>(keys: K[]): Observable<Pick<T, K>>
  /**
   * This is an dynamic overload. Use this approach only id necessary because it's not strongly typed.
   * @example
   * function selectFactory(dynamic?) {
   *   return weatherStore.select$(dynamic?);
   * }
   */
  public select$<R>(dynamic?: ProjectsOrKeys<T, R>): Observable<R>
  public select$<R, K extends keyof T>(projectsOrKeys?: ProjectsOrKeys<T, R>): Observable<T | R | R[] | T[K] | Pick<T, K>> {
    return this._select$<R, K>()(projectsOrKeys || [] as any)
  }

  public onAction(action: Actions | string): Pick<Store<T, E>, 'select$'> {
    return { select$: this._select$<any, any>(action) }
  }

  protected _select$<R, K extends keyof T>(action?: Actions | string):
    (projectsOrKeys?: ProjectsOrKeys<T, R>) => Observable<T | R | R[] | T[K] | Pick<T, K>> {
    return (projectsOrKeys?: ProjectsOrKeys<T, R>) => {
      const tillLoaded$ = this._isLoading$.asObservable()
        .pipe(
          filter(x => !x),
          distinctUntilChanged(),
          switchMap(() => this._value$),
        )
      const mapPredicate: (value: Readonly<T>) => T | R | any[] | T[K] | Pick<T, K> = (() => {
        if (isArray(projectsOrKeys)) {
          if (isFunction(projectsOrKeys[0])) {
            return (value: Readonly<T>) => (projectsOrKeys as ((value: Readonly<T>) => R)[]).map(x => x(value))
          }
          if (isString(projectsOrKeys[0])) {
            return (value: Readonly<T>) => {
              const result = {};
              (projectsOrKeys as string[]).forEach((x: string) => result[x] = value[x])
              return result
            }
          }
        }
        if (isString(projectsOrKeys)) return (value: Readonly<T>) => value[projectsOrKeys as string]
        if (isFunction(projectsOrKeys)) return projectsOrKeys
        return (x: Readonly<T>) => x
      })()
      const filterPredicate = (value: Readonly<T> | null): value is Readonly<T> => {
        return !this.isPaused
          && !queryContext.isDisposed
          && (!action || action === this._lastAction)
          && !!value
      }
      const queryContext: QueryContext = {
        wasHardReset: false,
        isDisposed: false,
        observable: this._value$.asObservable()
          .pipe(
            mergeMap(x => iif(() => this.isLoading && action != Actions.loading, tillLoaded$, of(x))),
            filter(filterPredicate),
            map(mapPredicate),
            distinctUntilChanged((prev, curr) => {
              if (queryContext.wasHardReset) return false
              return (isObject(prev) && isObject(curr)) ? this._compare(prev, curr) : prev === curr
            }),
            tap(() => queryContext.wasHardReset = false),
            map(x => isObject(x) ? this._clone(x) : x),
          )
      }
      this._queryContext.push(queryContext)
      return queryContext.observable
    }
  }

  //#endregion query-methods
}
