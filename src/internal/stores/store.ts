import { iif, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { assert, isArray, isFunction, isObject, isString } from '../helpers'
import { BaseStore } from './base-store'
import { StoreConfigOptions } from './config'
import { Actions, ProjectsOrKeys, QueryableStore, QueryContext, WriteableStore } from './store-accessories'

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
export class Store<T extends object, E = any> extends BaseStore<T, T, E> implements QueryableStore<T, E>, WriteableStore<T, E> {

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
    super(initialValueOrNull, storeConfig)
  }

  //#endregion constructor
  //#region query-methods

  protected _select$<R, K extends keyof T>(
    projectsOrKeys?: ProjectsOrKeys<T, R>,
    action?: Actions | string
  ): Observable<T | R | R[] | T[K] | Pick<T, K>> {
    const tillLoaded$ = this._isLoading$.asObservable()
      .pipe(
        filter(x => !x),
        distinctUntilChanged(),
        switchMap(() => this._value$),
      )
    const mapPredicate: (value: Readonly<T>) => T | R | any[] | T[K] | Pick<T, K> = (() => {
      if (isArray(projectsOrKeys)) {
        if ((<((value: Readonly<T>) => R)[]>projectsOrKeys).every(x => isFunction(x))) {
          return (value: Readonly<T>) => (<((value: Readonly<T>) => R)[]>projectsOrKeys).map(x => x(value))
        }
        if ((<string[]>projectsOrKeys).every(x => isString(x))) {
          return (value: Readonly<T>) => {
            const result = {};
            (<string[]>projectsOrKeys).forEach((x: string) => result[x] = value[x])
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
          // filter(filterPredicate),
          // TODO: check this filter
          // TODO: use takeWhile for is disposed parameter
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
    this._queryContextsList.push(queryContext)
    return queryContext.observable
  }

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
  public select$<R extends any[]>(projects: ((value: Readonly<T>) => any)[]): Observable<R>
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
    return this._select$<R, K>(projectsOrKeys)
  }

  public onAction<R>(action: Actions | string): Pick<QueryableStore<T, E>, 'select$'> {
    return { select$: (projectsOrKeys?: ProjectsOrKeys<T, R>) => this._select$<any, any>(projectsOrKeys, action) }
  }

  //#endregion query-methods
  //#region write-methods

  /**
   * Updates the store's state using a partial state. The provided partial state will be then merged with current store's state.
   * - If you want to override the current store's state, use the `override` method.
   * @example
   *  weatherStore.update({ isWindy: true });
   */
  public update(value: Partial<T>, actionName?: string): void
  /**
   * Updates the store's state using a function that will be called by the store.
   * The function will be provided with the current state as a parameter and it must return a new partial state.
   * The returned partial state will be then merged with current store's state.
   * - If you want to override the current store's state, use the `override` method.
   * @example
   * weatherStore.update(state => ({
   *    isSunny: !state.isRaining
   * }));
   */
  public update(valueFunction: (value: Readonly<T>) => Partial<T>, actionName?: string): void
  public update(valueOrFunction: ((value: Readonly<T>) => Partial<T>) | Partial<T>, actionName?: string): void {
    this._update(valueOrFunction, /** isMerge */ true, actionName || Actions.update, this.onUpdate)
  }

  /**
   * Overrides the current state's value completely.
   */
  public override(newValue: T, actionName?: string): void {
    this._update(newValue, /** isMerge */ false, actionName || Actions.override, this.onOverride)
  }

  protected _update(
    valueOrFunction: ((value: Readonly<T>) => Partial<T>) | Partial<T> | T,
    isMerge: boolean,
    actionName: string,
    onUpdate?: (nextState: T, prevState: Readonly<T>) => void | T,
  ): void {
    if (this.isPaused) return
    assert(this.isInitialized, `Store: "${this._storeName}" can't be updated before it was initialized`)
    this._setState(value => {
      valueOrFunction = isFunction(valueOrFunction) ? valueOrFunction(value) : valueOrFunction
      const tmpValue = valueOrFunction
      let newValue: T = isMerge ? this._merge(this._clone(value), this._clone(valueOrFunction)) : valueOrFunction as T
      if (this._isClassHandler) {
        assert(!!this._instancedValue, `Store: "${this._storeName}" instanced handler is configured but an instanced value was not provided.`)
        newValue = this._handleClasses(this._instancedValue, this._clone(newValue))
      }
      if (isFunction(onUpdate)) {
        const newModifiedValue: T | void = onUpdate(this._clone(newValue), value)
        if (newModifiedValue) newValue = this._clone(newModifiedValue)
      }
      return tmpValue == newValue ? this._clone(newValue) : newValue
    }, actionName)
  }

  //#endregion write-methods
}
