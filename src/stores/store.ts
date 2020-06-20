import { BehaviorSubject, iif, isObservable, Observable, of, timer } from 'rxjs'
import { debounce, distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { DevToolsDataStruct, DevToolsSubjects } from '../dev-tools'
import { deepFreeze, instanceHandler, isFunction, isNull, isObject, logError, mergeObjects, objectAssign, simpleCloneObject, throwError } from '../helpers'
import { isDev, isDevTools } from '../mode'
import { BaseStore } from './base-store'
import { Storages, StoreConfigOptions } from './config'
import { validateStorageKey, validateStoreName } from './store-unique-name-enforcer'

/**
 * @example
 * const createUiState: UiState = () => {
 * 	return {...}
 * }
 *
 * `@`StoreConfig({
 * 	name: 'UI-STORE'
 * })
 * export class UiStore extends Store<UiState, AppError> {
 *
 * 	constructor() {
 * 		super(createUiState())
 * 	}
 * }
 */
export class Store<T extends object, E = any> extends BaseStore<T, E> {

  //#region state-properties

  private readonly _state$ = new BehaviorSubject<T | null>(null)
  private _state: Readonly<T> | null = null
  private set state(value: T | null) {
    this._state = value
    this._state$.next(value)
  }
  /**
   * Returns stores current state's value.
   */
  public get value(): T | null {
    return isNull(this._state) ? this._state : this._clone(this._state)
  }

  private _initialState: Readonly<T> | null = null
  /**
   * Returns stores initial state's value.
   */
  public get initialValue(): Readonly<T> | null {
    return this._initialState
  }

  //#endregion state-properties
  //#region private properties

  private get devData(): DevToolsDataStruct {
    return { name: this._storeName, state: this._state ? simpleCloneObject(this._state) : {} }
  }
  private _initializeAsyncPromise: Promise<void> | null = null

  //#endregion private properties
  //#region constructor

  /**
   * @param initialState - Null as an initial state will activate stores loading state.
   * @param storeConfig ? - Set this parameter only if you creating
   * store's instance without extending it.
   */
  constructor(initialState: null, storeConfig?: StoreConfigOptions)
  /**
   * @param initialState - Set all state's params for the initial value. Use Null for
   * unneeded properties instead of undefined.
   * @param storeConfig ?- Set this parameter only if you creating
   * store's instance without extending it.
   */
  constructor(initialState: T, storeConfig?: StoreConfigOptions)
  constructor(initialState: T | null, storeConfig?: StoreConfigOptions)
  constructor(initialStateOrNull: T | null, storeConfig?: StoreConfigOptions) {
    super()
    this._main(initialStateOrNull, storeConfig)
  }

  //#endregion constructor
  //#region private-section

  private _main(initialStateOrNull: T | null, storeConfig?: StoreConfigOptions): void {
    this._initializeConfig(storeConfig)
    if (!this.config) throwError(`Store must be decorated with the "@StoreConfig" decorator or store config must supplied via the store's constructor!`)
    validateStoreName(this._storeName)
    if (this._config.storageType != Storages.none) validateStorageKey(this._storageKey, this._storeName)
    if (isDevTools()) DevToolsSubjects.stores[this._storeName] = this
    if (isNull(initialStateOrNull)) {
      this._isLoading$.next(true)
      isDevTools() && DevToolsSubjects.loadingEvent$.next(this._storeName)
    } else {
      this._initializeStore(initialStateOrNull)
    }
  }

  private _initializeStore(initialState: T): void {
    let isStateCloned = false
    if (isFunction(this['onBeforeInit'])) {
      const modifiedInitialState: T | void = this['onBeforeInit'](this._clone(initialState))
      if (modifiedInitialState) {
        initialState = this._clone(modifiedInitialState)
        isStateCloned = true
      }
    }
    this._initialState = deepFreeze(this._clone(initialState))
    const storage = this._storage
    if (storage) {
      let storedState: T | null = this._parse(storage.getItem(this._storageKey))
      if (storedState) {
        if (!this._isSimpleCloning) storedState = instanceHandler(initialState, storedState)
        initialState = storedState
        isStateCloned = true
      }
      this._state$
        .pipe(debounce(() => timer(this._storageDebounce)))
        .subscribe(state => storage.setItem(this._storageKey, this._stringify(state)))
    }
    this._setState(() => isStateCloned ? initialState : this._clone(initialState))
    if (isFunction(this['onAfterInit'])) {
      const modifiedState: T | void = this['onAfterInit'](this._clone(this._state!))
      if (modifiedState) this._setState(() => this._clone(modifiedState))
    }
    isDevTools() && DevToolsSubjects.initEvent$.next(this.devData)
  }

  private _setState(newStateFn: (state: Readonly<T> | null) => T): void {
    this.state = isDev() ? deepFreeze(newStateFn(this._state)) : newStateFn(this._state)
  }

  //#endregion private-section
  //#region public-api

  /**
   * Use this method to initialize the store.
   * - Use only if the constructor state's value was null.
   * - Will throw in development mode if the store is not in loading state
   * or it was initialized before.
   * - In production mode, this method will be ignored if the store is not in loading state
   * or it was initialized before.
   */
  public initialize(initialState: T): void | never {
    if (!this.isLoading || this._initialState || this._state) {
      isDev() && throwError("Can't initialize store that's already been initialized or its not in LOADING state!")
      return
    }
    this._initializeStore(initialState)
    this._isLoading$.next(false)
  }

  /**
   * Use this method to initialize the store with async data.
   * - Use only if the constructor state's value was null.
   * - Will throw in development mode if the store is not in loading state
   * or it was initialized before.
   * - In production mode, this method will be ignored if the store is not in loading state
   * or it was initialized before.
   * - In case of observable, only finite observable value will be used.
   */
  public initializeAsync(promise: Promise<T>): Promise<void>
  public initializeAsync(observable: Observable<T>): Promise<void>
  public initializeAsync(promiseOrObservable: Promise<T> | Observable<T>): Promise<void> {
    this._initializeAsyncPromise = new Promise((resolve, reject) => {
      if (!this.isLoading || this._initialState || this._state) {
        const errMsg = `Can't initialize store ${this._storeName} that's already been initialized or its not in LOADING state!`
        if (isDev()) {
          reject(new Error(errMsg))
        } else {
          logError(errMsg)
          resolve()
        }
      }
      if (isObservable(promiseOrObservable)) {
        promiseOrObservable = promiseOrObservable.toPromise()
      }
      promiseOrObservable.then(r => {
        if (!this.isLoading || this._initialState || this._state) {
          isDev() && reject('The store was initialized multiple time whiles it was in loading state.')
        } else {
          if (isFunction(this['onAsyncInitSuccess'])) {
            const modifiedResult = this['onAsyncInitSuccess'](r)
            if (modifiedResult) r = modifiedResult
          }
          this._initializeStore(r)
          this._isLoading$.next(false)
        }
      }).catch(e => {
        if (isFunction(this['onAsyncInitError'])) {
          e = this['onAsyncInitError'](e)
        }
        e && reject(e)
      }).finally(resolve)
    })
    return this._initializeAsyncPromise
  }

  /**
   * Update the store's value
   * @example
   *  this.store.update({ key: value })
   */
  public update(state: Partial<T>, updateName?: string): void
  /**
   * Update the store's value
   * @example
   * this.store.update(state => {
   *   return {...}
   * })
   */
  public update(stateCallback: (state: Readonly<T>) => Partial<T>, updateName?: string): void
  public update(stateOrCallback: ((state: Readonly<T>) => Partial<T>) | Partial<T>, updateName?: string): void {
    const initialState = this._initialState
    if (this.isLoading && !DevToolsSubjects.isLoadingErrorsDisabled) {
      logError(`Can't update ${this._storeName} while it's in loading state.`)
    } else if (!initialState) {
      const errMsg = `Store: ${this._storeName} can't be updated while the initial state is null.`
      isDev() ? throwError(errMsg) : logError(errMsg)
    } else {
      this._setState(state => {
        if (!state) throwError(`Store: ${this._storeName} can't update state`)
        const newPartialState = isFunction(stateOrCallback) ? stateOrCallback(state) : stateOrCallback
        let newState = mergeObjects(this._clone(state), this._clone(newPartialState))
        if (!this._isSimpleCloning) newState = instanceHandler(initialState, newState)
        if (isFunction(this['onUpdate'])) {
          const newModifiedState: T | void = this['onUpdate'](this._clone(newState), state)
          if (newModifiedState) newState = this._clone(newModifiedState)
        }
        return newState
      })
      isDevTools() && DevToolsSubjects.updateEvent$.next(updateName ? objectAssign(this.devData, { updateName }) : this.devData)
    }
  }

  /**
   * Overrides the state's value completely, without merging.
   */
  public override(state: T): void {
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
      isDev() && DevToolsSubjects.overrideEvent$.next(this.devData)
    }
  }

  /**
   * Resets the store's state to it's initial value.
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
      isDevTools() && DevToolsSubjects.resetEvent$.next({ name: this._storeName, state: simpleCloneObject(initialState) })
    }
  }

  /**
   * Resets the following store parameters:
   * - State will be set to null.
   * - Initial state will be set to null.
   * - Activates Loading state.
   * - Store's error will be set to null.
   * - Clears cached storage if any.
   */
  public hardReset(): this {
    if (!this._isResettable) {
      const errMsg = `Store: ${this._storeName} is not configured as resettable.`
      isDev() ? throwError(errMsg) : logError(errMsg)
    } else {
      isDevTools() && DevToolsSubjects.hardResetEvent$.next(this._storeName)
      this._isLoading$.next(true)
      this.state = null
      this._initialState = null
      this.setError(null)
      this._storage && this._storage.removeItem(this._storageKey)
      isDevTools() && DevToolsSubjects.loadingEvent$.next(this._storeName)
    }
    return this
  }

  /**
   * @deprecated Use select$ instead.
   */
  public select(): Observable<T>
  /**
   * @deprecated Use select$ instead.
   */
  public select<R>(project: (state: T) => R): Observable<R>
  public select<R>(project?: (state: T) => R): Observable<T | R> {
    return this.select$(project)
  }

  /**
   * Returns whole state as an Observable.
   * @example
   * state$ = this.store.select()
   *
   * myFunc() {
   * 	this.tate$.subscribe(state => {
   * 		// do some work...
   * 	})
   * }
   */
  public select$(): Observable<T>
  /**
   * Returns partial state as an Observable.
   * @example
   * isSideNavOpen$ = this.store.select(state => state.isSideNavOpen)
   *
   * myFunc() {
   * 	this.isSideNavOpen$.subscribe(isSideNavOpen => {
   * 		// do some work...
   * 	})
   * }
   */
  public select$<R>(project: (state: T) => R): Observable<R>
  /**
   * Returns partial or whole state as an Observable based on the given project function.
   * @example
   * mySelect(projectionFunction = undefined) {
   * 	this.store.select(projectionFunction)
   * }
   */
  public select$<R>(project: ((state: T) => R) | undefined): Observable<R>
  public select$<R>(project?: (state: T) => R): Observable<T | R> {
    const tillLoaded$ = this._isLoading$.asObservable()
      .pipe(
        filter(x => !x),
        distinctUntilChanged(),
        switchMap(() => this._state$),
      )
    let wasHardReseted = false
    return this._state$.asObservable()
      .pipe(
        tap(x => {
          if (!wasHardReseted) wasHardReseted = !x && this.isLoading
        }),
        mergeMap(x => iif(() => this.isLoading, tillLoaded$, of(x))),
        filter<T | null, T>((x => !!x) as (value: T | null) => value is T),
        map<T, T | R>(project || (x => x)),
        distinctUntilChanged((prev, curr) => {
          if (wasHardReseted) {
            wasHardReseted = false
            return false
          }
          return (isObject(prev) && isObject(curr)) ? this._compare(prev, curr) : prev === curr
        }),
        map(x => isObject(x) ? this._clone(x) : x),
      )
  }

  //#endregion public-api
}
