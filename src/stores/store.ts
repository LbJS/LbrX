import { BehaviorSubject, iif, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { DevToolsDataStruct, DevToolsSubjects, StoreStates } from '../dev-tools'
import { isDev, isDevTools } from '../mode'
import { SelectScope } from '../types'
import { getPromiseState, instanceHandler, isFunction, isNull, isObject, logError, mergeObjects, objectAssign, PromiseStates, simpleCloneObject, throwError } from '../utils'
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

  //#region state-properties

  /**
   * This is a protected property. Proceed with care.
   */
  protected _state$ = new BehaviorSubject<T | null>(null)
  /**
   * This is a protected property. Proceed with care.
   */
  protected get _state(): Readonly<T> | null {
    return this._state$.value
  }
  protected set _state(value: Readonly<T> | null) {
    this._state$.next(value)
  }

  /**
   * Returns the current store's state.
   */
  public get state(): T | null {
    const state = this._state$.value
    return isNull(state) ? null : this._clone(state)
  }

  /**
   * @deprecated
   */
  public get value(): T | null {
    const state = this._state$.value
    return isNull(state) ? null : this._clone(state)
  }

  /**
   * This is a protected property. Proceed with care.
   */
  protected _initialState: Readonly<T> | null = null
  /**
   * Returns the initial store's state.
   */
  public get initialState(): Readonly<T> | null {
    return this._initialState
  }

  /**
   * @deprecated
   */
  public get initialValue(): Readonly<T> | null {
    return this._initialState
  }

  //#endregion state-properties
  //#region private properties

  /**
   * This is a protected property. Proceed with care.
   */
  protected get devData(): DevToolsDataStruct {
    return { name: this._storeName, state: this._state ? simpleCloneObject(this._state) : {} }
  }

  //#endregion private properties
  //#region constructor

  /**
   * Synchronous initialization.
   */
  constructor(initialState: T, storeConfig?: StoreConfigOptions)
  /**
   * Asynchronous or delayed initialization.
   * The store will be set into loading state till initialization.
   */
  constructor(initialState: null, storeConfig?: StoreConfigOptions)
  /**
   * Dynamic initialization.
   */
  constructor(initialState: T | null, storeConfig?: StoreConfigOptions)
  constructor(initialStateOrNull: T | null, storeConfig?: StoreConfigOptions) {
    super()
    this._main(initialStateOrNull, storeConfig)
  }

  //#endregion constructor
  //#region protected-methods

  protected _getState$(): Observable<T | null> {
    return this._state$
  }

  protected _getState(): T | T[] | null {
    return this._state
  }

  protected _setState(newStateFn: (state: Readonly<T> | null) => T): void {
    this._state = this._mergeStates(newStateFn, this._state)
    this._setNormalState()
  }

  protected _getInitialState(): Readonly<T | T[]> | null {
    return this._initialState
  }

  protected _setInitialState(state: Readonly<T> | null): void {
    this._initialState = state
  }

  protected _getDevData(): DevToolsDataStruct {
    return this.devData
  }

  //#endregion protected-methods
  //#region public-methods

  public initialize(initialState: T): void {
    if (this._assertInitializable()) this._initializeStore(initialState)
  }

  public initializeAsync(promise: Promise<T>): Promise<void>
  public initializeAsync(observable: Observable<T>): Promise<void>
  public initializeAsync(promiseOrObservable: Promise<T> | Observable<T>): Promise<void> {
    return super.initializeAsync(promiseOrObservable)
  }

  /**
   * Updates the store's state using a partial state. The provided partial state will be then merged with current store's state.
   * - If you want to override the current store's state, use the `override` method.
   * @example
   *  weatherStore.update({ isWindy: true });
   */
  public update(state: Partial<T>, updateName?: string): void
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
  public update(stateFunction: (state: Readonly<T>) => Partial<T>, updateName?: string): void
  public update(stateOrFunction: ((state: Readonly<T>) => Partial<T>) | Partial<T>, updateName?: string): void {
    if (this._isPaused) return
    const initialState = this._initialState
    if (this.isLoading && !DevToolsSubjects.isLoadingErrorsDisabled) {
      const errMsg = `Can't update ${this._storeName} while it's in loading state.`
      isDev() ? throwError(errMsg) : logError(errMsg)
    } else if (!initialState) {
      const errMsg = `Store: ${this._storeName} can't be updated while the initial state is null.`
      isDev() ? throwError(errMsg) : logError(errMsg)
    } else {
      this._setState(state => {
        if (!state) throwError(`Store: ${this._storeName} can't update state`)
        const newPartialState = isFunction(stateOrFunction) ? stateOrFunction(state) : stateOrFunction
        let newState = mergeObjects(this._clone(state), this._clone(newPartialState))
        if (!this._isSimpleCloning) newState = instanceHandler(initialState, newState)
        if (isFunction(this['onUpdate'])) {
          const newModifiedState: T | void = this['onUpdate'](this._clone(newState), state)
          if (newModifiedState) newState = this._clone(newModifiedState)
        }
        return newState
      })
      if (isDevTools()) DevToolsSubjects.updateEvent$.next(updateName ? objectAssign(this.devData, { updateName }) : this.devData)
    }
  }

  /**
   * Overrides the current store's state completely.
   */
  public override(state: T): void {
    if (this._isPaused) return
    if (this.isLoading && !DevToolsSubjects.isLoadingErrorsDisabled) {
      logError(`Can't override ${this._storeName} while it's in loading state.`)
    } else if (!this._initialState) {
      const errMsg = `Store: ${this._storeName} can't be overridden while the initial state is null.`
      isDev() ? throwError(errMsg) : logError(errMsg)
    } else {
      if (!this._isSimpleCloning) state = instanceHandler(this._initialState, this._clone(state))
      let modifiedState: T | void
      if (isFunction(this['onOverride'])) {
        modifiedState = this['onOverride'](this._clone(state), this._state)
        if (modifiedState) state = this._clone(modifiedState)
      }
      const isCloned = !this._isSimpleCloning || !!modifiedState
      this._setState(() => isCloned ? state : this._clone(state))
      if (isDev()) DevToolsSubjects.overrideEvent$.next(this.devData)
    }
  }

  /**
   * Resets the store's state to it's initial state.
   */
  public reset(): void | never {
    const initialState = this._initialState
    if (this.isLoading && !DevToolsSubjects.isLoadingErrorsDisabled) {
      const errMsg = `Can't reset ${this._storeName} while it's in loading state.`
      isDev() ? throwError(errMsg) : logError(errMsg)
    } else if (!this._isResettable) {
      const errMsg = `Store: ${this._storeName} is not configured as resettable.`
      isDev() ? throwError(errMsg) : logError(errMsg)
    } else if (!initialState) {
      const errMsg = `Store: ${this._storeName} can't be reseted while the initial state is null.`
      isDev() ? throwError(errMsg) : logError(errMsg)
    } else {
      this._setState(state => {
        let modifiedInitialState: T | void
        if (isFunction(this['onReset'])) modifiedInitialState = this['onReset'](this._clone(initialState), state)
        return this._clone(modifiedInitialState || initialState)
      })
      if (isDevTools()) DevToolsSubjects.resetEvent$.next({ name: this._storeName, state: simpleCloneObject(initialState) })
    }
  }

  /**
   * Sets the following:
   * - Store's state will be set to `null`.
   * - Store's initial state will be set to `null`.
   * - Store's error will be set to `null`.
   * - Sets _isPaused_ to `false`.
   * - Sets the store to 'Loading...' state.
   * - Clears store's cache storage if any (LocalStorage, SessionStorage, etc.).
   */
  public hardReset(): Promise<this> {
    if (!this._isResettable) {
      const errMsg = `Store: ${this._storeName} is not configured as resettable.`
      return Promise.reject(new Error(errMsg))
    }
    this._storesState = StoreStates.hardResetting
    if (isDevTools()) DevToolsSubjects.hardResetEvent$.next(this._storeName)
    const asyncInitPromise = this._asyncInitPromise
    const initializeAsyncPromiseState: Promise<void | PromiseStates> = asyncInitPromise.promise ?
      getPromiseState(asyncInitPromise.promise) :
      Promise.resolve()
    return new Promise((resolve) => {
      const reset = () => {
        this.isPaused = false
        this.isLoading = true
        this._state = null
        this._initialState = null
        this.error = null
        if (this._stateToStorageSub) this._stateToStorageSub.unsubscribe()
        if (this._storage) this._storage.removeItem(this._storageKey)
        this._selectScopes.forEach(x => x.wasHardReset = true)
        if (isDevTools()) DevToolsSubjects.loadingEvent$.next(this._storeName)
        resolve(this)
      }
      initializeAsyncPromiseState
        .then(state => {
          asyncInitPromise.isCancelled = state === PromiseStates.pending
          reset()
        }).catch(() => reset())
    })
  }

  /**
   * Returns the state as an Observable.
   * @example
   * weatherStore.select$().subscribe(state => {
   *   // do something with the weather...
   * });
   */
  public select$(): Observable<T>
  /**
   * Returns the extracted partial state as an Observable based on the provided projection method.
   * @example
   * weatherStore.select$(state => state.isRaining)
   *   .subscribe(isRaining => {
   *     if (isRaining) {
   *        // do something when it's raining...
   *     }
   *  });
   */
  public select$<R>(project: (state: T) => R): Observable<R>
  /**
   * Returns the state or the extracted partial state as an Observable based on the provided projection method if it is provided.
   * - This overload provides you with a more dynamic approach compare to other overloads.
   * - With this overload you can create an dynamic Observable factory.
   * @example
   * stateProjectionFactory(optionalProjection) {
   *   return weatherStore.select$(optionalProjection);
   * }
   */
  public select$<R>(project?: (state: T) => R): Observable<T | R>
  public select$<R>(project?: (state: T) => R): Observable<T | R> {
    const tillLoaded$ = this._isLoading$.asObservable()
      .pipe(
        filter(x => !x),
        distinctUntilChanged(),
        switchMap(() => this._state$),
      )
    const selectContainer: SelectScope = {
      wasHardReset: false,
      isDisPosed: false,
      observable: this._state$.asObservable()
        .pipe(
          mergeMap(x => iif(() => this.isLoading, tillLoaded$, of(x))),
          filter<T | null, T>((x => !!x && !this._isPaused) as (value: T | null) => value is T),
          map<T, T | R>(project || (x => x)),
          distinctUntilChanged((prev, curr) => {
            if (selectContainer.wasHardReset) return false
            return (isObject(prev) && isObject(curr)) ? this._compare(prev, curr) : prev === curr
          }),
          tap(() => selectContainer.wasHardReset = false),
          map(x => isObject(x) ? this._clone(x) : x),
        )
    }
    this._selectScopes.push(selectContainer)
    return selectContainer.observable
  }

  public disposeSelect(observable: Observable<T>): void {
    const selectScopes = this._selectScopes
    const i = selectScopes.findIndex(x => x.observable = observable)
    if (i != -1) {
      selectScopes[i].isDisPosed = true
      selectScopes.splice(i, 1)
    }
  }

  //#endregion public-methods
}
