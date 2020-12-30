import { iif, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, switchMap, takeWhile, tap } from 'rxjs/operators'
import { assert, isArray, isFunction, isObject } from '../helpers'
import { BaseStore } from './base-store'
import { StoreConfigOptions } from './config'
import { Actions, ObservableQueryContext, Project, ProjectsOrKeys, QueryableStore, WriteableStore } from './store-accessories'
import { StoreContext } from './store-context'

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
export class Store<S extends object, E = any> extends BaseStore<S, S, E> implements QueryableStore<S, E>, WriteableStore<S, E> {

  //#region helper-props

  /** @internal */
  protected readonly _whenLoaded$: Observable<Readonly<S> | null> = this.isLoading$
    .pipe(
      filter(x => !x),
      switchMap(() => this._value$),
    )

  //#endregion helper-props
  //#region constructor

  /**
   * Synchronous initialization.
   */
  constructor(initialValue: S, storeConfig?: StoreConfigOptions)
  /**
   * Asynchronous or delayed initialization.
   * The store will be set into loading state till initialization.
   */
  constructor(initialValue: null, storeConfig?: StoreConfigOptions)
  /**
   * Dynamic initialization.
   */
  constructor(initialValue: S | null, storeConfig?: StoreConfigOptions)
  constructor(initialValueOrNull: S | null, storeConfig?: StoreConfigOptions) {
    super(storeConfig)
    this._preInit(initialValueOrNull)
  }

  //#endregion constructor
  //#region query-methods

  /** @internal */
  protected _select$<R, K extends keyof S>(
    projectsOrKeys?: ProjectsOrKeys<S, R>,
    actionOrActions?: Actions | string | (Actions | string)[]
  ): Observable<S | R | R[] | S[K] | Pick<S, K>> {
    if (actionOrActions && !isArray(actionOrActions)) actionOrActions = [actionOrActions]
    const takeWhilePredicate = () => {
      return !selectContext.isDisposed
    }
    const actionFilterPredicate = () => !actionOrActions || (<(Actions | string)[]>actionOrActions).some(x => x === this._lastAction)
    const mainFilterPredicate = (value: Readonly<S> | null): value is Readonly<S> => {
      return !this.isPaused
        && !selectContext.isDisposed
        && !!value
    }
    const project: Project<S, R> = this._getProjectionMethod(projectsOrKeys)
    const selectContext: ObservableQueryContext = {
      doSkipOneChangeCheck: false,
      isDisposed: false,
      observable: this._value$.asObservable()
        .pipe(
          takeWhile(takeWhilePredicate),
          filter(actionFilterPredicate),
          mergeMap(x => iif(() => this.isLoading, this._whenLoaded$, of(x))),
          filter(mainFilterPredicate),
          map(project),
          distinctUntilChanged((prev, curr) => {
            if (selectContext.doSkipOneChangeCheck) return false
            return (isObject(prev) && isObject(curr)) ? this._compare(prev, curr) : prev === curr
          }),
          tap(() => selectContext.doSkipOneChangeCheck = false),
          map(x => this._cloneIfObject(x)),
        )
    }
    this._observableQueryContextsList.push(selectContext)
    return selectContext.observable
  }

  /**
   * Returns the state's value as an Observable.
   * @example
   * weatherStore.select$().subscribe(value => {
   *   // do something with the weather...
   * });
   */
  public select$(): Observable<S>
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
  public select$<R>(project: (value: Readonly<S>) => R): Observable<R>
  /**
   * Returns an array values as an Observable based on the provided projection methods.
   * @example
   * weatherStore.select$([value => value.isRaining, value => value.precipitation])
   *   .subscribe(result => {
   *     const [isRaining, precipitation] = result
   *     // do something...
   *  });
   */
  public select$<R extends ReturnType<M>, M extends ((value: Readonly<S>) => any)>(projects: M[]): Observable<R[]>
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
  public select$<R extends any[]>(projects: ((value: Readonly<S>) => any)[]): Observable<R>
  /**
   * Returns as single the state's value property based on the provided key.
   * @example
   * weatherStore.select$('precipitation')
   *   .subscribe(precipitation => {
   *     // do something...
   *  });
   */
  public select$<K extends keyof S>(key: K): Observable<S[K]>
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
  public select$<K extends keyof S>(keys: K[]): Observable<Pick<S, K>>
  /**
   * This is an dynamic overload. Use this approach only if necessary because it's not strongly typed.
   * @example
   * function selectFactory(dynamic?) {
   *   return weatherStore.select$(dynamic?);
   * }
   */
  public select$<R>(dynamic?: ProjectsOrKeys<S, R>): Observable<R>
  public select$<R, K extends keyof S>(projectsOrKeys?: ProjectsOrKeys<S, R>): Observable<S | R | R[] | S[K] | Pick<S, K>> {
    return this._select$<R, K>(projectsOrKeys)
  }

  /**
   * Will invoke the chained method only on the provided action.
   * @example
   * onAction('update').select$(projector)
   */
  public onAction<R>(action: Actions | string): Pick<QueryableStore<S, E>, 'select$'>
  /**
   * Will invoke the chained method only on the provided action.
   * @example
   * onAction(['update', 'myCustomActionName']).select$(projector)
   */
  public onAction<R>(actions: (Actions | string)[]): Pick<QueryableStore<S, E>, 'select$'>
  /**
   * Dynamic overload.
   */
  public onAction<R>(actionOrActions: Actions | string | (Actions | string)[]): Pick<QueryableStore<S, E>, 'select$'>
  public onAction<R>(actionOrActions: Actions | string | (Actions | string)[]): Pick<QueryableStore<S, E>, 'select$'> {
    return { select$: (projectsOrKeys?: ProjectsOrKeys<S, R>) => this._select$<any, any>(projectsOrKeys, actionOrActions) }
  }

  /**
   * Returns the state's value.
   * @example
   * const value = weatherStore.select()
   */
  public select(): S
  /**
   * Returns the extracted partial state's value based on the provided projection method.
   * @example
   * const isRaining = weatherStore.select(value => value.isRaining)
   */
  public select<R>(project: (value: Readonly<S>) => R): R
  /**
   * Returns an array values based on the provided projection methods.
   * @example
   * const [isRaining, precipitation] = weatherStore.select([value => value.isRaining, value => value.precipitation])
   */
  public select<R extends ReturnType<M>, M extends ((value: Readonly<S>) => any)>(projects: M[]): R[]
  /**
   * Returns an array values based on the provided projections methods.
   * - This overload allows to manually define the return type.
   * @example
   * const [isRaining, precipitation] = weatherStore.select([value => value.isRaining, value => value.precipitation])
   */
  public select<R extends any[]>(projects: ((value: Readonly<S>) => any)[]): R
  /**
   * Returns as single the state's value property based on the provided key.
   * @example
   * const precipitation = weatherStore.select('precipitation')
   */
  public select<K extends keyof S>(key: K): S[K]
  /**
   * Returns the extracted partial state's value based on the provided keys.
   * @example
   * const { precipitation, isRaining } = weatherStore.select(['precipitation', 'isRaining'])
   */
  public select<K extends keyof S>(keys: K[]): Pick<S, K>
  /**
   * This is an dynamic overload. Use this approach only if necessary because it's not strongly typed.
   * @example
   * function selectFactory(dynamic?) {
   *   return weatherStore.select(dynamic?);
   * }
   */
  public select<R>(dynamic?: ProjectsOrKeys<S, R>): R
  public select<R, K extends keyof S>(projectsOrKeys?: ProjectsOrKeys<S, R>): S | R | R[] | S[K] | Pick<S, K> {
    const mapProject = this._getProjectionMethod(projectsOrKeys)
    const value = this._value
    assert(value, `Store: "${this._storeName}" has tried to access state's value before initialization.`)
    const mappedValue = mapProject(value)
    return this._cloneIfObject(mappedValue)
  }

  //#endregion query-methods
  //#region write-methods

  /** @internal */
  protected _update(
    valueOrFunction: ((value: Readonly<S>) => Partial<S>) | Partial<S> | S,
    isMerge: boolean,
    actionName: string,
    onUpdate?: (nextState: S, prevState: Readonly<S>) => void | S,
  ): void {
    if (this.isPaused) return
    assert(this.isInitialized, `Store: "${this._storeName}" can't be updated before it was initialized`)
    this._setState({
      valueFnOrState: value => {
        valueOrFunction = isFunction(valueOrFunction) ? valueOrFunction(value) : valueOrFunction
        let newValue: S = isMerge ? this._merge(this._clone(value), this._clone(valueOrFunction)) : valueOrFunction as S
        if (this._isClassHandler) {
          assert(!!this._instancedValue, `Store: "${this._storeName}" instanced handler is configured but an instanced value was not provided.`)
          newValue = this._handleClasses(this._instancedValue, newValue)
        }
        if (isFunction(onUpdate)) {
          const newModifiedValue: S | void = onUpdate(this._clone(newValue), value)
          if (newModifiedValue) newValue = isMerge ? this._clone(newModifiedValue) : newModifiedValue
        }
        return newValue
      }, actionName, doSkipClone: isMerge
    })
  }

  /**
   * Updates the store's state using a partial state. The provided partial state will be then merged with current store's state.
   * - If you want to override the current store's state, use the `override` method.
   * @example
   *  weatherStore.update({ isWindy: true });
   */
  public update(value: Partial<S>, actionName?: string): void
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
  public update(valueFunction: (value: Readonly<S>) => Partial<S>, actionName?: string): void
  public update(valueOrFunction: ((value: Readonly<S>) => Partial<S>) | Partial<S>, actionName?: string): void {
    this._update(valueOrFunction, /** isMerge */ true, actionName || Actions.update, this.onUpdate)
  }

  /**
   * Overrides the current state's value completely.
   */
  public override(newValue: S, actionName?: string): void {
    this._update(newValue, /** isMerge */ false, actionName || Actions.override, this.onOverride)
  }

  //#endregion write-methods
  //#region store-context

  public getContext(saveChangesActionName?: string | null, onAction?: Actions | string | (Actions | string)[]): StoreContext<S> {
    return new StoreContext<S>(this, this._observableQueryContextsList, saveChangesActionName || undefined, onAction)
  }

  //#endregion store-context
}
