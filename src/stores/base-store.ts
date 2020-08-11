import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { DevToolsSubjects, StoreStates } from '../dev-tools'
import { isDev, isDevTools } from '../mode'
import { Class, cloneError, cloneObject, compareObjects, deepFreeze, isEmpty, isError, isNull, isObject, isUndefined, logError, logWarn, simpleCloneObject, simpleCompareObjects, throwError } from '../utils'
import { ObjectCompareTypes, Storages, StoreConfig, StoreConfigInfo, StoreConfigOptions, STORE_CONFIG_KEY } from './config'
import { LbrxErrorStore } from './lbrx-error-store'

export abstract class BaseStore<T extends object, E = any> {

  //#region static

  /**
   * This is a protected property. Proceed with care.
   * - Used as private.
   */
  protected static _storageKeys: string[] = []

  /**
   * This is a protected property. Proceed with care.
   * - Used as private.
   */
  protected static _storeNames: string[] = []

  //#endregion static

  //#region loading-state

  // TODO: add isPausing

  /**
   * This is a protected property.
   * We do not recommend overriding this method.
   * Proceed with care.
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
   * This is a protected property.
   * We do not recommend overriding this method.
   * Proceed with care.
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
  public storesState$: Observable<StoreStates> = this._storesState$.asObservable().pipe(distinctUntilChanged())
  /**
   * This is a protected property. Proceed with care.
   */
  protected get _storesState(): StoreStates {
    return this._storesState$.value
  }
  protected set _storesState(value: StoreStates) {
    this._storesState$.next(value)
  }

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
  //#region constructor

  constructor(initialStateOrNull: T | T[] | null, storeConfig?: StoreConfigOptions) {
    this._main(initialStateOrNull, storeConfig)
  }

  //#endregion constructor
  //#region private-section

  /**
   * This is a protected method. Proceed with care.
   * - Used as private.
   */
  protected _main(initialStateOrNull: T | T[] | null, storeConfig?: StoreConfigOptions): void {
    if (isUndefined(initialStateOrNull)) throwError('Initial state cannot be undefined.')
    this._initializeConfig(storeConfig)
    if (!this.config) throwError(`Store must be decorated with the "@StoreConfig" decorator or store config must supplied via the store's constructor!`)
    this._validateStoreName(this._storeName)
    if (this._config.storageType != Storages.none) this._validateStorageKey(this._storageKey, this._storeName)
    if (isDevTools()) DevToolsSubjects.stores[this._storeName] = this
    if (isNull(initialStateOrNull)) {
      this._isLoading$.next(true)
      if (isDevTools()) DevToolsSubjects.loadingEvent$.next(this._storeName)
    }
  }

  /**
   * This is a protected method. Proceed with care.
   * - Used as private.
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
      const errorMsg = `This storage key is not unique: "${storageKey}" from store: "${storeName}"!`
      isDev() ? throwError(errorMsg) : logError(errorMsg)
    } else {
      BaseStore._storageKeys.push(storageKey)
    }
  }

  /**
   * This is a protected method. Proceed with care.
   */
  protected _validateStoreName(storeName: string): void {
    if (BaseStore._storeNames.includes(storeName)) {
      const errorMsg = `There are multiple stores with the same store name: "${storeName}"!`
      isDev() ? throwError(errorMsg) : logError(errorMsg)
    } else {
      BaseStore._storeNames.push(storeName)
    }
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

  //#endregion private-section
  //#region public-api

  //#endregion public-api
}
