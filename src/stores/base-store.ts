import { BehaviorSubject, isObservable, Observable, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'
import { DevToolsDataStruct, DevToolsSubjects, StoreStates } from '../dev-tools'
import { isDev, isDevTools } from '../mode'
import { Clone, Compare, Parse, SelectScope, Stringify } from '../types'
import { Class, cloneError, cloneObject, compareObjects, deepFreeze, getPromiseState, instanceHandler, isEmpty, isError, isFunction, isNull, isObject, isUndefined, logWarn, newError, PromiseStates, simpleCloneObject, simpleCompareObjects, throwError } from '../utils'
import { ObjectCompareTypes, Storages, StoreConfig, StoreConfigInfo, StoreConfigOptions, STORE_CONFIG_KEY } from './config'
import { LbrxErrorStore } from './lbrx-error-store'

const onBeforeInit = 'onBeforeInit'
const onAsyncInitSuccess = 'onAsyncInitSuccess'
const onAsyncInitError = 'onAsyncInitError'
const onAfterInit = 'onAfterInit'

export abstract class BaseStore<T extends object, E = any> {

  //#region static

  /** @internal */
  protected static _storageKeys: string[] = []

  /** @internal */
  protected static _storeNames: string[] = []

  //#endregion static
  //#region paused-state

  /** @internal */
  protected _isPaused$ = new BehaviorSubject(false)

  public isPaused$: Observable<boolean> = this._isPaused$.asObservable().pipe(distinctUntilChanged())

  /**
   * Paused state will ignore any kind of update operations and potential state distributions via observables.
   */
  public get isPaused(): boolean {
    return this._isPaused$.value
  }
  public set isPaused(value: boolean) {
    this._isPaused$.next(value)
    if (value) {
      this._storesState = StoreStates.paused
      if (isDevTools()) DevToolsSubjects.pausedEvent$.next(this._storeName)
    }
  }

  //#endregion paused-state
  //#region loading-state

  /** @internal */
  protected readonly _isLoading$ = new BehaviorSubject(false)
  /**
   * Weather or not the store is in it's loading state.
   * - If the initial value at the constructor is null,
   * the store will automatically set it self to a loading state and
   * then will set it self to none loading state after it wil be initialized.
   * - While the store is in loading state, no values will be emitted to state's subscribers.
   */
  public isLoading$: Observable<boolean> = this._isLoading$.asObservable().pipe(distinctUntilChanged())
  public get isLoading(): boolean {
    return this._isLoading$.value
  }
  public set isLoading(value: boolean) {
    this._isLoading$.next(value)
    if (value) {
      this._storesState = StoreStates.loading
      if (isDevTools()) DevToolsSubjects.loadingEvent$.next(this._storeName)
    }
  }

  //#endregion loading-state
  //#region error-api

  /** @internal */
  protected readonly _error$ = new BehaviorSubject<E | null>(null)
  /**
   * Store's error state.
   */
  public error$: Observable<E | null> =
    this._error$.asObservable()
      .pipe(
        map(x => {
          if (isError(x)) return cloneError(x)
          if (isObject(x)) return cloneObject(x)
          return x
        }),
        distinctUntilChanged((prev, curr) => isNull(prev) && isNull(curr)),
      )

  /**
   * @get Returns the store's error state value.
   * @set Sets store's error state and also sets global error state if the value is not null.
   */
  public get error(): E | null {
    const value = this._error$.value
    if (isError(value)) return cloneError(value)
    if (isObject(value)) return cloneObject(value)
    return value
  }
  public set error(value: E | null) {
    if (isError(value)) {
      value = cloneError(value)
    } else if (isObject(value)) {
      value = cloneObject(value)
    }
    this._error$.next(value)
    if (!isEmpty(value)) LbrxErrorStore.getStore<E>().setError(value)
  }

  //#endregion error-api
  //#region stores-state

  /** @internal */
  protected _storesState$ = new BehaviorSubject<StoreStates>(StoreStates.normal)
  /** @internal */
  protected get _storesState(): StoreStates {
    return this._storesState$.value
  }
  protected set _storesState(value: StoreStates) {
    this._storesState$.next(value)
  }

  public storesState$: Observable<StoreStates> = this._storesState$.asObservable().pipe(distinctUntilChanged())

  //#endregion stores-state
  //#region config

  /** @internal */
  protected _config!: StoreConfigInfo
  /**
   * Returns store's active configuration.
   */
  public get config(): StoreConfigInfo {
    return this._config
  }
  /** @internal */
  protected _storeName!: string
  /** @internal */
  protected _isResettable!: boolean
  /** @internal */
  protected _isSimpleCloning!: boolean
  /** @internal */
  protected _objectCompareType!: ObjectCompareTypes
  /** @internal */
  protected _storage!: Storage | null
  /** @internal */
  protected _storageDebounce!: number
  /** @internal */
  protected _storageKey!: string
  /** @internal */
  protected _clone!: Clone
  /** @internal */
  protected _compare!: Compare
  /** @internal */
  protected _stringify!: Stringify
  /** @internal */
  protected _parse!: Parse

  //#endregion config
  //#region protected-properties

  /** @internal */
  protected _asyncInitPromise = this._createAsyncInitPromiseObj()

  /** @internal */
  protected _stateToStorageSub: Subscription | null = null

  /** @internal */
  protected _selectScopes: SelectScope[] = []

  //#endregion protected-properties
  //#region constructor

  constructor() { }

  //#endregion constructor
  //#region protected-methods

  /**
   * This is a protected method. Proceed with care.
   */
  protected _main(initialStateOrNull: T | T[] | null, storeConfig?: StoreConfigOptions): void {
    this._initializeConfig(storeConfig)
    if (!this.config) throwError('Store must be provided with store configuration, either via constructor or via decorator.')
    const storeName = this._storeName
    this._validateStoreName(storeName)
    if (this._config.storageType != Storages.none) this._validateStorageKey(this._storageKey, storeName)
    if (isUndefined(initialStateOrNull)) throwError(`Store: "${storeName}" was provided with "undefined" as initial state.`)
    if (isDevTools()) DevToolsSubjects.stores[storeName] = this
    if (isNull(initialStateOrNull)) {
      this.isLoading = true
    } else {
      this._initializeStore(initialStateOrNull)
    }
  }

  /**
   * This is a protected method. Proceed with care.
   */
  protected _initializeConfig(storeConfig?: StoreConfigOptions): void {
    if (storeConfig) StoreConfig(storeConfig)(this.constructor as Class)
    this._config = cloneObject(this.constructor[STORE_CONFIG_KEY])
    delete this.constructor[STORE_CONFIG_KEY]
    this._storeName = this._config.name
    this._isResettable = this._config.isResettable
    this._isSimpleCloning = this._config.isSimpleCloning
    this._clone = this._isSimpleCloning ? simpleCloneObject : cloneObject
    this._objectCompareType = this._config.objectCompareType
    this._compare = (() => {
      switch (this._objectCompareType) {
        case ObjectCompareTypes.advanced: return compareObjects
        case ObjectCompareTypes.simple: return simpleCompareObjects
        case ObjectCompareTypes.reference: return (a: object | any[], b: object | any[]) => a === b
      }
    })()
    this._config.objectCompareTypeName = ['Reference', 'Simple', 'Advanced'][this._objectCompareType]
    if (this._config.storageType != Storages.custom) {
      if (this._config.customStorageApi) {
        logWarn(`Custom storage api is configured but storage type is not set to custom. Store name: ${this._storeName}`)
      }
      this._config.customStorageApi = null
    }
    if (this._config.storageType == Storages.custom && !this._config.customStorageApi) {
      logWarn(`Custom storage type is configured while custom storage api is not. Store name: ${this._storeName}`)
      this._config.storageType = Storages.none
    }
    this._storage = (() => {
      switch (this._config.storageType) {
        case Storages.none: return null
        case Storages.local: return localStorage
        case Storages.session: return sessionStorage
        case Storages.custom: return this._config.customStorageApi
      }
    })()
    this._config.storageTypeName = [
      'None',
      'Local-Storage',
      'Session-Storage',
      'Custom',
    ][this._config.storageType]
    this._storageDebounce = this._config.storageDebounceTime
    this._storageKey = this._config.storageKey
    this._stringify = this._config.stringify
    this._parse = this._config.parse
  }

  public _assertInitializable(outError?: Error): boolean | never {
    if (!this.isLoading || this._getInitialState() || this._getState()) {
      const errMsg = `Can't initialize store: "${this._storeName}" because one of the following reasons: 1.) The store has already been initialized. 2.) The store is not in loading state.`
      if (outError) {
        if (!outError.message) outError.message = errMsg
        return false
      } else {
        throwError(errMsg)
      }
    }
    return true
  }

  /**
   * This is a protected method. Proceed with care.
   */
  protected _initializeStore(initialState: T | T[]): void {
    let isStateFromStorage = false
    const storage = this._storage
    if (storage) {
      const storedState: T | T[] | null = this._parse(storage.getItem(this._storageKey))
      if (storedState) {
        initialState = this._isSimpleCloning ? storedState : instanceHandler(initialState, storedState)
        isStateFromStorage = true
      }
      this._stateToStorageSub = this._getState$()
        .pipe(debounceTime(this._storageDebounce))
        .subscribe(state => storage.setItem(this._storageKey, this._stringify(state)))
    }
    if (isFunction(this[onBeforeInit])) {
      const modifiedInitialState: T | T[] | null = this[onBeforeInit](this._clone(initialState))
      if (modifiedInitialState) {
        initialState = this._clone(modifiedInitialState)
        isStateFromStorage = false
      }
    }
    initialState = isStateFromStorage ? initialState : this._clone(initialState)
    this._setInitialValue(deepFreeze(initialState))
    this._setState(() => this._clone(initialState))
    if (isFunction(this[onAfterInit])) {
      const modifiedState: T | T[] | null = this[onAfterInit](this._clone(this._getState()))
      if (modifiedState) this._setState(() => this._clone(modifiedState))
    }
    this.isLoading = false
    if (isDevTools()) DevToolsSubjects.initEvent$.next(this._getDevData())
  }

  /**
   * This is a protected method. Proceed with care.
   */
  protected _mergeStates<S extends object>(newStateFn: (state: S | null) => S, currState: S | null): S {
    return isDev() ? deepFreeze(newStateFn(currState)) : newStateFn(currState)
  }

  /**
   * This is a protected method. Proceed with care.
   */
  protected _validateStorageKey(storageKey: string, storeName: string): void {
    if (BaseStore._storageKeys.includes(storageKey)) {
      const errorMsg = `Storage key: "${storageKey}" in store name: "${storeName}" is not unique.`
      throwError(errorMsg)
    }
    BaseStore._storageKeys.push(storageKey)
  }

  /**
   * This is a protected method. Proceed with care.
   */
  protected _validateStoreName(storeName: string): void {
    if (BaseStore._storeNames.includes(storeName)) {
      const errorMsg = `Store name: "${storeName}" is not unique.`
      throwError(errorMsg)
    }
    BaseStore._storeNames.push(storeName)
  }

  /**
   * This is a protected method. Proceed with care.
   */
  protected _createAsyncInitPromiseObj(): { promise: Promise<void> | null, isCancelled: boolean } {
    return {
      promise: null,
      isCancelled: false,
    }
  }

  protected _setNormalState(): void {
    this._storesState = StoreStates.normal
  }

  //#endregion protected-methods
  //#region public-methods

  /**
   * Method for asynchronous initialization.
   * - In case of an observable, only the finite value will be used.
   */
  public initializeAsync(promiseOrObservable: Promise<T | T[]> | Observable<T | T[]>): Promise<void> {
    const asyncInitPromise = this._createAsyncInitPromiseObj()
    this._asyncInitPromise = asyncInitPromise
    asyncInitPromise.promise = new Promise((resolve, reject) => {
      const error = newError()
      if (!this._assertInitializable(error)) return reject(error)
      if (isObservable(promiseOrObservable)) promiseOrObservable = promiseOrObservable.toPromise()
      promiseOrObservable.then(r => {
        if (asyncInitPromise.isCancelled) return
        if (!this._assertInitializable(error)) {
          return reject(error)
        } else {
          if (isFunction(this[onAsyncInitSuccess])) {
            const modifiedResult = this[onAsyncInitSuccess](r)
            if (modifiedResult) r = modifiedResult
          }
          this._initializeStore(r)
        }
      }).catch(e => {
        if (asyncInitPromise.isCancelled) return
        if (isFunction(this[onAsyncInitError])) {
          e = this[onAsyncInitError](e)
        }
        if (e) return reject(e)
      }).finally(resolve)
    })
    return asyncInitPromise.promise
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
        if (this._stateToStorageSub) this._stateToStorageSub.unsubscribe()
        if (this._storage) this._storage.removeItem(this._storageKey)
        this.error = null
        this._setStateToNull()
        this._setInitialValue(null)
        this._selectScopes.forEach(x => x.wasHardReset = true)
        this.isPaused = false
        this.isLoading = true
        resolve(this)
      }
      initializeAsyncPromiseState
        .then(state => {
          asyncInitPromise.isCancelled = state === PromiseStates.pending
          reset()
        }).catch(() => reset())
    })
  }

  public disposeSelect(observable: Observable<T | T[]>): void {
    const selectScopes = this._selectScopes
    const i = selectScopes.findIndex(x => x.observable = observable)
    if (i != -1) {
      selectScopes[i].isDisPosed = true
      selectScopes.splice(i, 1)
    }
  }

  //#endregion public-methods
  //#region protected-abstract-methods

  /**
   * This is a protected method. Proceed with care.
   */
  protected abstract _getState$(): Observable<T | T[] | null>
  /**
   * This is a protected method. Proceed with care.
   */
  protected abstract _getState(): T | T[] | null
  /**
   * This is a protected method. Proceed with care.
   */
  protected abstract _setState(newStateFna: (state: Readonly<T | T[]> | null) => T | T[]): void
  /**
   * This is a protected method. Proceed with care.
   */
  protected abstract _setStateToNull(): void
  /**
   * This is a protected method. Proceed with care.
   */
  protected abstract _getInitialState(): Readonly<T | T[]> | null
  /**
   * This is a protected method. Proceed with care.
   */
  protected abstract _setInitialValue(state: Readonly<T | T[]> | null): void
  /**
   * This is a protected method. Proceed with care.
   */
  protected abstract _getDevData(): DevToolsDataStruct

  //#endregion protected-abstract-methods
  //#region public-abstract-methods

  /**
   * Method used for delayed initialization.
   */
  public abstract initialize(initialState: T | T[]): void

  //#endregion public-abstract-methods
}
