import { BehaviorSubject, isObservable, Observable, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'
import { DevToolsDataStruct, DevToolsSubjects, StoreStates } from '../dev-tools'
import { isDev, isDevTools } from '../mode'
import { SelectScope } from '../types'
import { Class, cloneError, cloneObject, compareObjects, deepFreeze, instanceHandler, isEmpty, isError, isFunction, isNull, isObject, isUndefined, logWarn, newError, simpleCloneObject, simpleCompareObjects, throwError } from '../utils'
import { ObjectCompareTypes, Storages, StoreConfig, StoreConfigInfo, StoreConfigOptions, STORE_CONFIG_KEY } from './config'
import { LbrxErrorStore } from './lbrx-error-store'

const onBeforeInit = 'onBeforeInit'
const onAsyncInitSuccess = 'onAsyncInitSuccess'
const onAsyncInitError = 'onAsyncInitError'
const onAfterInit = 'onAfterInit'

export abstract class BaseStore<T extends object, E = any> {

  //#region static

  /**
   * This is a protected property. Proceed with care.
   */
  protected static _storageKeys: string[] = []

  /**
   * This is a protected property. Proceed with care.
   */
  protected static _storeNames: string[] = []

  //#endregion static
  //#region paused-state

  /**
   * This is a protected property. Proceed with care.
   */
  protected _isPaused = false

  /**
   * Paused state will ignore any kind of update operations and potential state distributions via observables.
   */
  public get isPaused(): boolean {
    return this._isPaused
  }
  public set isPaused(value: boolean) {
    this._isPaused = value
    if (value) {
      this._storesState = StoreStates.paused
      if (isDevTools()) DevToolsSubjects.pausedEvent$.next(this._storeName)
    }
  }

  //#endregion paused-state
  //#region loading-state

  /**
   * This is a protected property. Proceed with care.
   */
  protected readonly _isLoading$ = new BehaviorSubject<boolean>(false)
  /**
   * Weather or not the store is in it's loading state.
   * - If the initial value at the constructor is null,
   * the store will automatically set it self to a loading state and
   * then will set it self to none loading state after it wil be initialized.
   * - While the store is in loading state, no values will be emitted to state's subscribers.
   */
  public isLoading$: Observable<boolean> = this._isLoading$.asObservable().pipe(distinctUntilChanged())
  /**
   * @get Returns store's loading state.
   * @set Sets store's loading state.
   */
  public get isLoading(): boolean {
    return this._isLoading$.getValue()
  }
  public set isLoading(value: boolean) {
    this._isLoading$.next(value)
    this._storesState = StoreStates.loading
  }

  //#endregion loading-state
  //#region error-api

  /**
   * This is a protected property. Proceed with care.
   */
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

  /**
   * This is a protected property. Proceed with care.
   */
  protected _storesState$ = new BehaviorSubject<StoreStates>(StoreStates.normal)
  /**
   * This is a protected property. Proceed with care.
   */
  protected get _storesState(): StoreStates {
    return this._storesState$.value
  }
  protected set _storesState(value: StoreStates) {
    this._storesState$.next(value)
  }

  public storesState$: Observable<StoreStates> = this._storesState$.asObservable().pipe(distinctUntilChanged())

  //#endregion stores-state
  //#region config

  /**
   * This is a protected property. Proceed with care.
   */
  protected _config!: StoreConfigInfo
  /**
   * Returns store's active configuration.
   */
  public get config(): StoreConfigInfo {
    return this._config
  }
  /**
   * This is a protected property. Proceed with care.
   */
  protected _storeName!: string
  /**
   * This is a protected property. Proceed with care.
   */
  protected _isResettable!: boolean
  /**
   * This is a protected property. Proceed with care.
   */
  protected _isSimpleCloning!: boolean
  /**
   * This is a protected property. Proceed with care.
   */
  protected _objectCompareType!: ObjectCompareTypes
  /**
   * This is a protected property. Proceed with care.
   */
  protected _storage!: Storage | null
  /**
   * This is a protected property. Proceed with care.
   */
  protected _storageDebounce!: number
  /**
   * This is a protected property. Proceed with care.
   */
  protected _storageKey!: string
  /**
   * This is a protected property. Proceed with care.
   */
  protected _clone!: <R extends object | null>(obj: R) => R
  /**
   * This is a protected property. Proceed with care.
   */
  protected _compare!: <R extends object>(objA: R, pbjB: R) => boolean
  /**
   * This is a protected property. Proceed with care.
   */
  protected _stringify!: (
    value: any,
    replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
    space?: string | number
  ) => string
  /**
   * This is a protected property. Proceed with care.
   */
  protected _parse!: (text: string | null, reviver?: (this: any, key: string, value: any) => any) => T

  //#endregion config
  //#region protected-properties

  /**
   * This is a protected property. Proceed with care.
   */
  protected _asyncInitPromise = this._createAsyncInitPromiseObj()

  /**
   * This is a protected property. Proceed with care.
   */
  protected _stateToStorageSub: Subscription | null = null

  /**
   * This is a protected property. Proceed with care.
   */
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
      this._isLoading$.next(true)
      if (isDevTools()) DevToolsSubjects.loadingEvent$.next(storeName)
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
    this._setInitialState(deepFreeze(initialState))
    this._setState(() => this._clone(initialState))
    if (isFunction(this[onAfterInit])) {
      const modifiedState: T | T[] | null = this[onAfterInit](this._clone(this._getState()))
      if (modifiedState) this._setState(() => this._clone(modifiedState))
    }
    this._isLoading$.next(false)
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
  protected abstract _getInitialState(): Readonly<T | T[]> | null
  /**
   * This is a protected method. Proceed with care.
   */
  protected abstract _setInitialState(state: Readonly<T | T[]> | null): void
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
