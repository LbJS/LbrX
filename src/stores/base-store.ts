import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { cloneError, cloneObject, compareObjects, isEmpty, isError, isNull, isObject, logWarn, simpleCloneObject, simpleCompareObjects } from '../helpers'
import { ObjectCompareTypes, Storages, StoreConfigOptions, StoreConfigOptionsInfo, STORE_CONFIG_KEY } from './config'
import { GlobalErrorStore } from './global-error-store'

export abstract class BaseStore<T extends object, E = any> {

  //#region loading-state

  /**
   * This is a protected property.
   * We do not recommend overriding this method.
   * Please proceed with care.
   */
  protected readonly _isLoading$ = new BehaviorSubject<boolean>(false)
  /**
   * Weather or not the store is in it's loading state.
   * - If the initial value at the constructor is null,
   * the store will automatically set it self to a loading state and
   * then will set it self to none loading state after it wil be initialized.
   * - While the store is in loading state, no values will be emitted to state's subscribers.
   */
  public get isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable().pipe(distinctUntilChanged())
  }
  /**
   * @get Returns store's loading state.
   * @set Sets store's loading state.
   */
  public get isLoading(): boolean {
    return this._isLoading$.getValue()
  }
  public set isLoading(value: boolean) {
    this._isLoading$.next(value)
  }

  //#endregion loading-state
  //#region error-api

  /**
   * This is a protected property.
   * We do not recommend overriding this method.
   * Please proceed with care.
   */
  protected readonly _error$ = new BehaviorSubject<E | null>(null)
  /**
   * Store's error state.
   */
  public get error$(): Observable<E | null> {
    return this._error$.asObservable()
      .pipe(
        map(x => {
          if (isError(x)) return cloneError(x)
          if (isObject(x)) return cloneObject(x)
          return x
        }),
        distinctUntilChanged((prev, curr) => isNull(prev) && isNull(curr)),
      )
  }

  //#endregion error-api
  //#region config

  /**
   * This is a protected property.
   * We do not recommend overriding this method.
   * Please proceed with care.
   */
  protected _config!: StoreConfigOptionsInfo
  /**
   * Returns store's active configuration.
   */
  public get config(): StoreConfigOptionsInfo {
    return this._config
  }
  protected _storeName!: string
  protected _isResettable!: boolean
  protected _isSimpleCloning!: boolean
  protected _objectCompareType!: ObjectCompareTypes
  protected _storage!: Storage | null
  protected _storageDebounce!: number
  protected _storageKey!: string
  protected _clone!: <R extends object>(obj: R) => R
  protected _compare!: <R extends object>(objA: R, pbjB: R) => boolean
  protected _stringify!: (
    value: any,
    replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
    space?: string | number
  ) => string
  protected _parse!: (text: string | null, reviver?: (this: any, key: string, value: any) => any) => T

  //#endregion config
  //#region constructor

  constructor() { }

  //#endregion constructor
  //#region private-section

  /**
   * This is a protected method.
   * We do not recommend overriding this method.
   * Please proceed with care.
   */
  protected _initializeConfig(storeConfig?: StoreConfigOptions): void {
    this._config = cloneObject(storeConfig ? storeConfig : this.constructor[STORE_CONFIG_KEY])
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

  //#region public-api
  //#endregion private-section

  /**
   * Returns the store's error state value.
   */
  public getError(): E | null {
    const value = this._error$.getValue()
    if (isError(value)) return cloneError(value)
    if (isObject(value)) return cloneObject(value)
    return value
  }

  /**
   * Sets store's error state and also sets global error state if the value is not null.
   */
  public setError(value: E | null): void {
    if (isError(value)) {
      value = cloneError(value)
    } else if (isObject(value)) {
      value = cloneObject(value)
    }
    this._error$.next(value)
    if (!isEmpty(value)) GlobalErrorStore.getStore<E>().setError(value)
  }

  //#endregion public-api
}
