import { Observable } from 'rxjs'
import { assert, isFunction } from '../helpers'
import { BaseStore } from './base-store'
import { StoreConfigOptions } from './config'
import { Actions, GetReturnType, ProjectsOrKeys, QueryableStore, WriteableStore } from './store-accessories'
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

  /**
   * @deprecated
   * User the `get$()` method instead.
   */
  public select$<R, K extends keyof S>(projectsOrKeys?: ProjectsOrKeys<S, R>): Observable<S | R | R[] | S[K] | Pick<S, K>> {
    return this.get$<R>(projectsOrKeys)
  }

  /**
   * Returns the state's value as an Observable.
   * @example
   * weatherStore.get$().subscribe(value => {
   *   // do something with the weather...
   * });
   */
  public get$(): Observable<S>
  /**
   * Returns the extracted partial state's value as an Observable based on the provided projection method.
   * @example
   * weatherStore.get$(value => value.isRaining)
   *   .subscribe(isRaining => {
   *     if (isRaining) {
   *        // do something when it's raining...
   *     }
   *  });
   */
  public get$<R>(project: (value: Readonly<S>) => R): Observable<R>
  /**
   * Returns an array values as an Observable based on the provided projection methods.
   * @example
   * weatherStore.get$([value => value.isRaining, value => value.precipitation])
   *   .subscribe(result => {
   *     const [isRaining, precipitation] = result
   *     // do something...
   *  });
   */
  public get$<R extends ReturnType<M>, M extends ((value: Readonly<S>) => any)>(projects: M[]): Observable<R[]>
  /**
   * Returns an array values as an Observable based on the provided projections methods.
   * - This overload allows to manually define the return type.
   * @example
   * weatherStore.get$([value => value.isRaining, value => value.precipitation])
   *   .subscribe(result => {
   *     const [isRaining, precipitation] = result
   *     // do something...
   *  });
   */
  public get$<R extends any[]>(projects: ((value: Readonly<S>) => any)[]): Observable<R>
  /**
   * Returns as single the state's value property based on the provided key.
   * @example
   * weatherStore.get$('precipitation')
   *   .subscribe(precipitation => {
   *     // do something...
   *  });
   */
  public get$<K extends keyof S>(key: K): Observable<S[K]>
  /**
   * Returns the extracted partial state's value as an Observable based on the provided keys.
   * @example
   * weatherStore.get$(['precipitation', 'isRaining'])
   *   .subscribe(result => {
   *      if (result.isRaining && result.precipitation.mm > 10) {
   *        // do something...
   *      }
   *  });
   */
  public get$<K extends keyof S>(keys: K[]): Observable<Pick<S, K>>
  /**
   * This is an dynamic overload. Use this approach only if necessary because it's not strongly typed.
   * @example
   * function getFactory(dynamic?) {
   *   return weatherStore.get$(dynamic?);
   * }
   */
  public get$<R>(dynamic?: ProjectsOrKeys<S, R>): Observable<R>
  public get$<R>(projectsOrKeys?: ProjectsOrKeys<S, R>): Observable<GetReturnType<S, R>> {
    return this._get$<R>(null, null, projectsOrKeys)
  }

  /**
   * Will invoke the chained method only on the provided action.
   * @example
   * onAction('update').get$(projector)
   */
  public onAction<R>(action: Actions | string): Pick<QueryableStore<S, E>, 'get$'>
  /**
   * Will invoke the chained method only on the provided action.
   * @example
   * onAction(['update', 'myCustomActionName']).get$(projector)
   */
  public onAction<R>(actions: (Actions | string)[]): Pick<QueryableStore<S, E>, 'get$'>
  /**
   * Dynamic overload.
   */
  public onAction<R>(actionOrActions: Actions | string | (Actions | string)[]): Pick<QueryableStore<S, E>, 'get$'>
  public onAction(actionOrActions: Actions | string | (Actions | string)[]): Pick<QueryableStore<S, E>, 'get$'> {
    return {
      get$: <R>(projectsOrKeys?: ProjectsOrKeys<S, R>) =>
        this._get$<R>(null, actionOrActions, projectsOrKeys)
    }
  }

  /**
   * @deprecated
   * User the `get()` method instead.
   */
  public select<R>(projectsOrKeys?: ProjectsOrKeys<S, R>): R {
    return this.get(projectsOrKeys)
  }

  /**
   * Returns the state's value.
   * @example
   * const value = weatherStore.get()
   */
  public get(): S
  /**
   * Returns the extracted partial state's value based on the provided projection method.
   * @example
   * const isRaining = weatherStore.get(value => value.isRaining)
   */
  public get<R>(project: (value: Readonly<S>) => R): R
  /**
   * Returns an array values based on the provided projection methods.
   * @example
   * const [isRaining, precipitation] = weatherStore.get([value => value.isRaining, value => value.precipitation])
   */
  public get<R extends ReturnType<M>, M extends ((value: Readonly<S>) => any)>(projects: M[]): R[]
  /**
   * Returns an array values based on the provided projections methods.
   * - This overload allows to manually define the return type.
   * @example
   * const [isRaining, precipitation] = weatherStore.get([value => value.isRaining, value => value.precipitation])
   */
  public get<R extends any[]>(projects: ((value: Readonly<S>) => any)[]): R
  /**
   * Returns as single the state's value property based on the provided key.
   * @example
   * const precipitation = weatherStore.get('precipitation')
   */
  public get<K extends keyof S>(key: K): S[K]
  /**
   * Returns the extracted partial state's value based on the provided keys.
   * @example
   * const { precipitation, isRaining } = weatherStore.get(['precipitation', 'isRaining'])
   */
  public get<K extends keyof S>(keys: K[]): Pick<S, K>
  /**
   * This is an dynamic overload. Use this approach only if necessary because it's not strongly typed.
   * @example
   * function getFactory(dynamic?) {
   *   return weatherStore.get(dynamic?);
   * }
   */
  public get<R>(dynamic?: ProjectsOrKeys<S, R>): R
  public get<R, K extends keyof S>(projectsOrKeys?: ProjectsOrKeys<S, R>): S | R | R[] | S[K] | Pick<S, K> {
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
   * - If you want to override the current store's state, use the `set` method.
   * @example
   *  weatherStore.update({ isWindy: true });
   */
  public update(value: Partial<S>, actionName?: string): void
  /**
   * Updates the store's state using a function that will be called by the store.
   * The function will be provided with the current state as a parameter and it must return a new partial state.
   * The returned partial state will be then merged with current store's state.
   * - If you want to override the current store's state, use the `set` method.
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
   * @deprecated
   * Use the `set()` method instead.
   */
  public override(newValue: S, actionName?: string): void {
    // tslint:disable-next-line: deprecation
    this._update(newValue, /** isMerge */ false, actionName || Actions.set, this.onSet || this.onOverride)
  }

  /**
   * Overrides the current state's value completely.
   */
  public set(newValue: S, actionName?: string): void {
    // tslint:disable-next-line: deprecation
    this._update(newValue, /** isMerge */ false, actionName || Actions.set, this.onSet || this.onOverride)
  }

  //#endregion write-methods
  //#region store-context

  public getContext(saveChangesActionName?: string | null, onAction?: Actions | string | (Actions | string)[]): StoreContext<S> {
    return new StoreContext<S>(this, this._observableQueryContextsList, saveChangesActionName || undefined, onAction)
  }

  //#endregion store-context
}
