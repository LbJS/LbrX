import { iif, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { isObject, QueryScope } from '../helpers'
import { BaseStore } from './base-store'
import { StoreConfigOptions } from './config'

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
export class Store<T extends object, E = any> extends BaseStore<T, E> {

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
  public select$<R>(project: (value: Readonly<T>) => T | R): Observable<R>
  /**
   * Returns the state's value or the extracted partial value as an Observable based on the provided projection method if it is provided.
   * - This overload provides you with a more dynamic approach compare to other overloads.
   * - With this overload you can create an dynamic Observable factory.
   * @example
   * statesValueProjectionFactory(optionalProjection) {
   *   return weatherStore.select$(optionalProjection);
   * }
   */
  public select$<R>(project?: (value: Readonly<T>) => T | R): Observable<T | R>
  public select$<R>(project?: (value: Readonly<T>) => T | R): Observable<T | R> {
    const tillLoaded$ = this._isLoading$.asObservable()
      .pipe(
        filter(x => !x),
        distinctUntilChanged(),
        switchMap(() => this._value$),
      )
    const filterPredicate = (value: Readonly<T> | null): value is Readonly<T> => !!value
    const queryScope: QueryScope = {
      wasHardReset: false,
      isDisposed: false,
      observable: this._value$.asObservable()
        .pipe(
          mergeMap(x => iif(() => this.isLoading, tillLoaded$, of(x))),
          filter(() => !this.isPaused && !queryScope.isDisposed),
          filter(filterPredicate),
          map(project || (x => x)),
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

  //#endregion query-methods
}
