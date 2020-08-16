import { BehaviorSubject, isObservable, Observable, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'
import { DevToolsAdapter } from '../dev-tools'
import { isDev, isDevTools } from '../mode'
import { State, StateTags } from '../states'
import { capFirstLetter, Class, Clone, cloneError, cloneObject, Compare, compareObjects, createPromiseScope, deepFreeze, getPromiseState, instanceHandler, isError, isFunction, isNull, isObject, isUndefined, logWarn, mergeObjects, newError, objectAssign, Parse, PromiseScope, PromiseStates, QueryScope, simpleCloneObject, simpleCompareObjects, Stringify, throwError, UpdateName } from '../utils'
import { ObjectCompareTypes, Storages, StoreConfig, StoreConfigInfo, StoreConfigOptions, STORE_CONFIG_KEY } from './config'

//#region constant-strings
const onBeforeInit = 'onBeforeInit'
const onAsyncInitSuccess = 'onAsyncInitSuccess'
const onAsyncInitError = 'onAsyncInitError'
const onAfterInit = 'onAfterInit'
const onUpdate = 'onUpdate'
const onOverride = 'onOverride'
const onReset = 'onReset'

const customStorageApiImplementation = 'custom storage api implementation'
const providedWith = 'provided with'
const setToCustom = 'set to "custom"'
const isNotUnique = 'is not unique'
const isNotConfiguredAsResettable = 'is not configured as resettable'
const cantBe = "can't be"
const beforeItWasInitialized = 'before it was initialized'

function getStoreNameMsg(storeName: string, isFirstLetterCap: boolean = true): string {
  const msg = `store: "${storeName}"`
  return isFirstLetterCap ? capFirstLetter(msg) : msg
}
//#endregion constant-strings

export abstract class BaseStore<T extends object, E = any> {

  //#region static

  /** @internal */
  protected static _storageKeys: string[] = []

  /** @internal */
  protected static _storeNames: string[] = []

  //#endregion static
  //#region state

  /** @internal */
  protected _stateObj: State<T, E> = {
    value: null,
    isPaused: false,
    isLoading: false,
    isHardResettings: false,
    isDestroyed: false,
    error: null,
  }

  /** @internal */
  protected get _state(): State<T, E> {
    return this._stateObj
  }
  protected set _state(value: State<T, E>) {
    this._stateObj = value
    this._state$.next(value)
    this._isLoading$.next(value.isLoading)
    this._isPaused$.next(value.isPaused)
    this._error$.next(value.error)
    this._value$.next(value.value)
  }

  /** @internal */
  protected _state$ = new BehaviorSubject(this._state)

  /**
   * @get Returns the state.
   */
  public get state(): State<T, E> {
    return this._clone(this._state)
  }

  /** @internal */
  protected get _value(): Readonly<T> | null {
    return this._state.value
  }

  /** @internal */
  protected _value$ = new BehaviorSubject(this._value)

  /**
   * @get Returns state's value.
   */
  public get value(): Readonly<T> | null {
    return this._clone(this._value)
  }

  /** @internal */
  protected _isLoading$ = new BehaviorSubject(this._state.isLoading)
  /**
   * Store's loading state observable.
   */
  public isLoading$: Observable<boolean> = this._isLoading$.asObservable().pipe(distinctUntilChanged())

  /**
   * @get Returns whether ot not the store is in loading state.
   */
  public get isLoading(): boolean {
    return this._state.isLoading
  }

  /** @internal */
  protected _isPaused$ = new BehaviorSubject(this._state.isPaused)

  public isPaused$: Observable<boolean> = this._isPaused$.asObservable().pipe(distinctUntilChanged())

  /**
   * @get Returns whether ot not the store is in paused state.
   */
  public get isPaused(): boolean {
    return this._state.isPaused
  }
  public set isPaused(value: boolean) {
    this._setState({ isPaused: value })
  }

  /**
   * @get Returns string literal that represents the state's tag.
   */
  public get stateTag(): StateTags {
    const state = this._state
    if (state.isHardResettings) return StateTags.hardResetting
    if (state.isLoading) return StateTags.loading
    if (state.isPaused) return StateTags.paused
    if (state.isDestroyed) return StateTags.destroyed
    if (state.value) return StateTags.active
    if (state.error) return StateTags.error
    return StateTags.resolving
  }

  /** @internal */
  protected _initialValue: Readonly<T> | null = null

  /**
   * @get Returns the initial value.
   */
  public get initialValue(): Readonly<T> | null {
    return this._initialValue
  }

  //#endregion state
  //#region error-api

  /** @internal */
  protected _error$ = new BehaviorSubject<E | null>(this._state.error)
  /**
   * Store's error state.
   */
  public error$: Observable<E | null> =
    this._error$.asObservable()
      .pipe(
        map(x => isError(x) ? cloneError(x) : isObject(x) ? cloneObject(x) : x),
        distinctUntilChanged((prev, curr) => isNull(prev) && isNull(curr)),
      )

  /**
   * @get Returns the store's error state value.
   * @set Sets store's error state and also sets global error state if the value is not null.
   */
  public get error(): E | null {
    const value = this._state.error
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
    this._setState({ error: value })
  }

  //#endregion error-api
  //#region config

  /** @internal */
  protected _config!: StoreConfigInfo

  /**
   * @get Returns store's configuration.
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
  //#region helper

  /** @internal */
  protected _valueToStorageSub: Subscription | null = null

  /** @internal */
  protected _asyncInitPromiseScope: PromiseScope | null = null

  /** @internal */
  protected _queryScopes: QueryScope[] = []

  //#endregion helpers
  //#region constructor

  constructor() { }

  //#endregion constructor
  //#region initialization-methods

  /** @internal */
  protected _main(initialValueOrNull: T | null, storeConfig?: StoreConfigOptions): void {
    this._initializeConfig(storeConfig)
    if (!this.config) throwError(`Store must be ${providedWith} store configuration via decorator or via constructor.`)
    const storeName = this._storeName
    this._assertStoreNameValid(storeName)
    BaseStore._storeNames.push(storeName)
    if (this._config.storageType != Storages.none) {
      const storageKey = this._storageKey
      this._assertStorageKeyValid(this._storageKey, storeName)
      BaseStore._storageKeys.push(storageKey)
    }
    if (isUndefined(initialValueOrNull)) throwError(`${getStoreNameMsg(storeName)} was ${providedWith} "undefined" as initial state.`)
    DevToolsAdapter.stores[storeName] = this
    if (isNull(initialValueOrNull)) {
      this._setState({ isLoading: true })
    } else {
      this._initializeStore(initialValueOrNull)
    }
  }

  /** @internal */
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
    const storeName = this._storeName
    if (this._config.storageType != Storages.custom) {
      if (this._config.customStorageApi) {
        logWarn(`${getStoreNameMsg(storeName)} is provided with ${customStorageApiImplementation} while storage type is ${setToCustom}. ${capFirstLetter(customStorageApiImplementation)} is ignored.`)
      }
      this._config.customStorageApi = null
    }
    if (this._config.storageType == Storages.custom && !this._config.customStorageApi) {
      logWarn(`${getStoreNameMsg(storeName)} has storage type ${setToCustom} but non ${customStorageApiImplementation} was provided. Custom storage type configuration is ignored.`)
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

  /** @internal */
  protected _assertStoreNameValid(storeName: string): void {
    if (BaseStore._storeNames.includes(storeName)) {
      throwError(`Store name: "${storeName}"  ${isNotUnique}.`)
    }
  }

  /** @internal */
  protected _assertStorageKeyValid(storageKey: string, storeName: string): void {
    if (BaseStore._storageKeys.includes(storageKey)) {
      throwError(`Storage key: "${storageKey}" in ${getStoreNameMsg(storeName, false)} ${isNotUnique}.`)
    }
  }

  public _assertInitializable(reject?: (reason: any) => void): boolean | never {
    if (this.isLoading && !this._initialValue && !this._value) return true
    const errMsg = `${getStoreNameMsg(this._storeName)} has already been initialized. You can hard reset the store if you want to reinitialize it.`
    if (!reject) throwError(errMsg)
    reject(newError(errMsg))
    return false
  }

  /** @internal */
  protected _initializeStore(initialValue: T): void {
    let isValueFromStorage = false
    const storage = this._storage
    if (storage) {
      const storedValue: T | null = this._parse(storage.getItem(this._storageKey))
      if (storedValue) {
        initialValue = this._isSimpleCloning ? storedValue : instanceHandler(initialValue, storedValue)
        isValueFromStorage = true
      }
      this._valueToStorageSub = this._value$
        .pipe(debounceTime(this._storageDebounce))
        .subscribe(value => storage.setItem(this._storageKey, this._stringify(value)))
    }
    if (isFunction(this[onBeforeInit])) {
      const modifiedInitialValue: T | null = this[onBeforeInit](this._clone(initialValue))
      if (modifiedInitialValue) {
        initialValue = this._clone(modifiedInitialValue)
        isValueFromStorage = false
      }
    }
    initialValue = isValueFromStorage ? initialValue : this._clone(initialValue)
    this._initialValue = deepFreeze(initialValue)
    this._setState(() => this._clone(initialValue), { isLoading: false })
    if (isFunction(this[onAfterInit])) {
      const modifiedValue: T | null = this[onAfterInit](this._clone(this._value))
      if (modifiedValue) this._setState(() => this._clone(modifiedValue))
    }
  }

  /**
   * Method used for delayed initialization.
   */
  public initialize(initialValue: T): void {
    if (this._assertInitializable()) this._initializeStore(initialValue)
  }

  /**
   * Method for asynchronous initialization.
   * - In case of an observable, only the finite value will be used.
   */
  public initializeAsync(promise: Promise<T>): Promise<void>
  public initializeAsync(observable: Observable<T>): Promise<void>
  public initializeAsync(promiseOrObservable: Promise<T> | Observable<T>): Promise<void> {
    const asyncInitPromiseScope = createPromiseScope()
    this._asyncInitPromiseScope = asyncInitPromiseScope
    asyncInitPromiseScope.promise = new Promise((resolve, reject) => {
      if (!this._assertInitializable(reject)) return
      if (isObservable(promiseOrObservable)) promiseOrObservable = promiseOrObservable.toPromise()
      promiseOrObservable.then(r => {
        if (asyncInitPromiseScope.isCancelled) return
        if (!this._assertInitializable(reject)) return
        if (isFunction(this[onAsyncInitSuccess])) {
          const modifiedResult = this[onAsyncInitSuccess](r)
          if (modifiedResult) r = modifiedResult
        }
        this._initializeStore(r)
      }).catch(e => {
        if (asyncInitPromiseScope.isCancelled) return
        if (isFunction(this[onAsyncInitError])) {
          e = this[onAsyncInitError](e)
        }
        if (e) return reject(e)
      }).finally(resolve)
    })
    return asyncInitPromiseScope.promise
  }

  //#endregion initialization-methods
  //#region state-methods

  /** @internal */
  protected _setState(partialState: Partial<State<T, E>>): void
  protected _setState(newStateValueFn: (stateValue: Readonly<T> | null) => T): void
  protected _setState(
    newStateValueFn: (stateValue: Readonly<T> | null) => T,
    partialState: Partial<State<T, E>> & Partial<UpdateName>): void
  protected _setState(
    fnOrState: ((stateValue: Readonly<T> | null) => T) | Partial<State<T, E>>,
    partialState?: Partial<State<T, E>> & Partial<UpdateName>
  ): void {
    if (isFunction(fnOrState)) {
      const value = isDev() ? deepFreeze(fnOrState(this._value)) : fnOrState(this._value)
      partialState = objectAssign({ value }, partialState || null)
    }
    let updateName: string | undefined
    if (partialState && partialState.updateName) {
      updateName = partialState.updateName
      delete partialState.updateName
    }
    this._state = objectAssign(this._state, partialState || fnOrState)
    if (isDevTools()) {
      DevToolsAdapter.stateChange$.next({
        storeName: this._storeName,
        state: simpleCloneObject(this._state),
        updateName,
      })
    }
  }

  //#endregion state-methods
  //#region update-methods

  /**
   * Updates the store's state using a partial state. The provided partial state will be then merged with current store's state.
   * - If you want to override the current store's state, use the `override` method.
   * @example
   *  weatherStore.update({ isWindy: true });
   */
  public update(value: Partial<T>, updateName?: string): void
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
  public update(valueFunction: (value: Readonly<T>) => Partial<T>, updateName?: string): void
  public update(valueOrFunction: ((value: Readonly<T>) => Partial<T>) | Partial<T>, updateName?: string): void {
    if (this.isPaused) return
    this._setState(value => {
      this._assert(value && this._initialValue && !this.isLoading, `${cantBe} updated ${beforeItWasInitialized}`)
      const newPartialValue = isFunction(valueOrFunction) ? valueOrFunction(value) : valueOrFunction
      let newValue = mergeObjects(this._clone(value), this._clone(newPartialValue))
      if (!this._isSimpleCloning) newValue = instanceHandler(this._initialValue, newValue)
      if (isFunction(this[onUpdate])) {
        const newModifiedValue: T | void = this[onUpdate](this._clone(newValue), value)
        if (newModifiedValue) newValue = this._clone(newModifiedValue)
      }
      return newValue
    }, { updateName: updateName || 'Update' })
  }

  /**
   * Overrides the current state's value completely.
   */
  public override(value: T): void {
    if (this.isPaused) return
    this._assert(this._initialValue && !this.isLoading, `${cantBe} overridden ${beforeItWasInitialized}`)
    if (!this._isSimpleCloning) value = instanceHandler(this._initialValue, this._clone(value))
    let modifiedValue: T | void
    if (isFunction(this[onOverride])) {
      modifiedValue = this[onOverride](this._clone(value), this._value)
      if (modifiedValue) value = this._clone(modifiedValue)
    }
    const isCloned = !this._isSimpleCloning || !!modifiedValue
    this._setState(() => isCloned ? value : this._clone(value), { updateName: 'Override' })
  }

  //#endregion update-methods
  //#region reset-dispose-destroy-methods

  /**
   * Resets the state's value to it's initial value.
   */
  public reset(): void | never {
    this._setState(value => {
      const initialValue = this._initialValue
      this._assert(value && initialValue && !this.isLoading, `${cantBe} reseted ${beforeItWasInitialized}`)
      this._assert(this._isResettable, isNotConfiguredAsResettable)
      let modifiedInitialValue: T | void
      if (isFunction(this[onReset])) modifiedInitialValue = this[onReset](this._clone(initialValue), value)
      return this._clone(modifiedInitialValue || initialValue)
    }, { updateName: 'Reset' })
  }

  /**
   * Sets the following:
   * - State's value will be set to `null`.
   * - State's error will be set to `null`.
   * - Store's initial value will be set to `null`.
   * - Sets _isPaused_ to `false`.
   * - Sets the store into loading state.
   * - Clears store's cache storage if any (LocalStorage, SessionStorage, etc.).
   */
  public hardReset(): Promise<this> {
    if (!this._isResettable) {
      const errMsg = `${getStoreNameMsg(this._storeName)} ${isNotConfiguredAsResettable}.`
      return Promise.reject(new Error(errMsg))
    }
    this._setState({ isHardResettings: true })
    const asyncInitPromiseScope = this._asyncInitPromiseScope
    const initializeAsyncPromiseState: Promise<void | PromiseStates> =
      asyncInitPromiseScope && asyncInitPromiseScope.promise ?
        getPromiseState(asyncInitPromiseScope.promise) :
        Promise.resolve()
    return new Promise((resolve) => {
      const reset = () => {
        if (this._valueToStorageSub) this._valueToStorageSub.unsubscribe()
        if (this._storage) this._storage.removeItem(this._storageKey)
        this._queryScopes.forEach(x => x.wasHardReset = true)
        this._initialValue = null
        this._setState({
          value: null,
          error: null,
          isPaused: false,
          isHardResettings: false,
          isLoading: true,
        })
        resolve(this)
      }
      initializeAsyncPromiseState.then(state => {
        if (asyncInitPromiseScope) asyncInitPromiseScope.isCancelled = state === PromiseStates.pending
        reset()
      }).catch(() => reset())
    })
  }

  public disposeQueryScope(observable: Observable<T>): void {
    const queryScopes = this._queryScopes
    const i = queryScopes.findIndex(x => x.observable = observable)
    if (i != -1) {
      queryScopes[i].isDisPosed = true
      queryScopes.splice(i, 1)
    }
  }

  //#endregion reset-dispose-destroy-methods
  //#region helper-methods

  protected _assert(condition: any, errMsg: string): asserts condition {
    if (!condition) throwError(`${getStoreNameMsg(this._storeName)} ${errMsg}.`)
  }

  //#endregion helper-methods
}
