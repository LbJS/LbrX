import { BehaviorSubject, isObservable, Observable, Subject, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'
import { isDev, isStackTracingErrors } from '../core'
import { DevToolsAdapter, isDevTools, StoreDevToolsApi } from '../dev-tools'
import { assert, cloneError, cloneObject, compareObjects, deepFreeze, getPromiseState, handleObjectTypes, isArray, isCalledBy, isError, isFunction, isNull, isObject, isUndefined, logError, logWarn, mergeObjects, newError, objectAssign, objectKeys, PromiseStates, shallowCloneObject, shallowCompareObjects, throwError } from '../helpers'
import { Class } from '../types'
import { ObjectCompareTypes, Storages, StoreConfig, StoreConfigCompleteInfo, StoreConfigOptions, STORE_CONFIG_KEY } from './config'
import { Actions, Clone, CloneError, Compare, createPromiseContext, DestroyableStore, Freeze, getDefaultState, HandleTypes, InitializableStore, LazyInitContext, Merge, Parse, PromiseContext, QueryContext, QueryContextsList, State, StoreTags, Stringify } from './store-accessories'

export abstract class BaseStore<T extends object, S extends object | T, E = any> implements
  DestroyableStore<T, S, E>,
  InitializableStore<T, S, E> {

  //#region static

  /** @internal */
  protected static _storageKeys: string[] = []

  /** @internal */
  protected static _storeNames: string[] = []

  //#endregion static
  //#region state

  /** @internal */
  protected _stateSource: State<T, E> = getDefaultState()

  /** @internal */
  protected get _state(): State<T, E> {
    return this._stateSource
  }
  protected set _state(value: State<T, E>) {
    if (isStackTracingErrors() && isDev() && !isCalledBy(`_setState`, 0)) {
      logError(`Store: "${this._storeName}" has called "_state" setter not from "_setState" method.`)
    }
    this._stateSource = value
    DevToolsAdapter.states[this._storeName] = value
    DevToolsAdapter.values[this._storeName] = value.value
    this._state$.next(value)
    this._isLoading$.next(value.isLoading)
    this._isPaused$.next(value.isPaused)
    this._error$.next(value.error)
    this._value$.next(value.value)
  }

  /** @internal */
  protected readonly _state$ = new BehaviorSubject(this._state)

  public readonly state$ = this._state$.asObservable().pipe(map(x => this._clone(x)))

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
  protected readonly _value$ = new BehaviorSubject(this._value)

  /**
   * @get Returns state's value.
   */
  public get value(): T | null {
    return this._clone(this._value)
  }

  /** @internal */
  protected readonly _isLoading$ = new BehaviorSubject(this._state.isLoading)
  /**
   * Store's loading state observable.
   */
  public readonly isLoading$: Observable<boolean> = this._isLoading$.asObservable().pipe(distinctUntilChanged())

  /**
   * @get Returns whether ot not the store is in loading state.
   */
  public get isLoading(): boolean {
    return this._state.isLoading
  }

  /** @internal */
  protected readonly _isPaused$ = new BehaviorSubject(this._state.isPaused)

  public isPaused$: Observable<boolean> = this._isPaused$.asObservable().pipe(distinctUntilChanged())

  /**
   * @get Returns whether ot not the store is in paused state.
   */
  public get isPaused(): boolean {
    return this._state.isPaused
  }
  public set isPaused(value: boolean) {
    this._setState({ isPaused: value }, value ? Actions.paused : Actions.unpause)
  }

  /**
   * @get Returns string literal that represents the store's tag.
   */
  public get storeTag(): StoreTags {
    const state = this._state
    if (this.isDestroyed) return StoreTags.destroyed
    if (state.isHardResettings) return StoreTags.hardResetting
    if (state.isLoading) return StoreTags.loading
    if (state.isPaused) return StoreTags.paused
    if (state.error) return StoreTags.error
    if (state.value) return StoreTags.active
    return StoreTags.resolving
  }

  /** @internal */
  protected _initialValue: Readonly<T> | null = null

  /**
   * @get Returns the instanced value.
   */
  public get initialValue(): Readonly<T> | null {
    return this._initialValue
  }

  /** @internal */
  protected _instancedValue: Readonly<S> | null = null

  /**
   * @get Returns the instanced value.
   */
  public get instancedValue(): Readonly<S> | null {
    return this._instancedValue
  }

  /** @internal */
  protected _isDestroyed = false
  /**
   * @get Returns whether or not the store is destroyed.
   */
  public get isDestroyed(): boolean {
    return this._isDestroyed
  }

  /** @internal */
  protected _isInitialized = false
  /**
   * @get Returns whether or not the store is initialized.
   */
  public get isInitialized(): boolean {
    return this._isInitialized
  }

  //#endregion state
  //#region error-api

  /** @internal */
  protected readonly _error$ = new BehaviorSubject<E | null>(this._state.error)
  /**
   * Store's error state.
   */
  public readonly error$: Observable<E | null> =
    this._error$.asObservable()
      .pipe(
        map(x => isError(x) ? this._cloneError(x) : isObject(x) ? this._clone(x) : x),
        distinctUntilChanged((prev, curr) => isNull(prev) && isNull(curr)),
      )

  /**
   * @get Returns the store's error state value.
   * @set Sets store's error state and also sets global error state if the value is not null.
   */
  public get error(): E | null {
    const value = this._state.error
    if (isError(value)) return this._cloneError(value)
    if (isObject(value)) return this._clone(value)
    return value
  }
  public set error(value: E | null) {
    if (isError(value)) {
      value = this._cloneError(value)
    } else if (isObject(value)) {
      value = this._clone(value)
    }
    this._setState({ error: value }, Actions.error)
  }

  //#endregion error-api
  //#region config

  /** @internal */
  protected readonly _config: StoreConfigCompleteInfo

  /**
   * @get Returns store's configuration.
   */
  public get config(): StoreConfigCompleteInfo {
    return this._config
  }

  /** @internal */
  protected readonly _storeName: string

  /** @internal */
  protected readonly _isResettable: boolean

  /** @internal */
  protected readonly _isSimpleCloning: boolean

  /** @internal */
  protected readonly _isInstanceHandler: boolean

  /** @internal */
  protected readonly _objectCompareType: ObjectCompareTypes

  /** @internal */
  protected readonly _storage: Storage | null

  /** @internal */
  protected readonly _storageDebounce: number

  /** @internal */
  protected readonly _storageKey: string

  /** @internal */
  protected readonly _clone: Clone

  /** @internal */
  protected readonly _compare: Compare

  /** @internal */
  protected readonly _freeze: Freeze

  /** @internal */
  protected readonly _handleTypes: HandleTypes

  /** @internal */
  protected readonly _stringify: Stringify

  /** @internal */
  protected readonly _parse: Parse

  /** @internal */
  protected readonly _cloneError: CloneError

  /** @internal */
  protected readonly _merge: Merge

  //#endregion config
  //#region helper

  /** @internal */
  protected readonly _queryContextsList: Array<QueryContext> & QueryContextsList = new QueryContextsList(this)

  /** @internal */
  protected _valueToStorageSub: Subscription | null = null

  /** @internal */
  protected _asyncInitPromiseContext: PromiseContext | null = null

  /** @internal */
  protected _lastAction: string | null = null

  /** @internal */
  protected _lazyInitContext: LazyInitContext<T> | null = null

  /** @internal */
  protected get _devToolsApi(): StoreDevToolsApi {
    return {
      isInstanceHandler: this._isInstanceHandler,
      instancedValue: this._instancedValue,
      handleTypes: this._handleTypes,
      setState: (value: State<T>) => {
        this._state = value
      }
    }
  }

  //#endregion helpers
  //#region constructor

  constructor(initialValueOrNull: T | null, storeConfig?: StoreConfigOptions) {
    //#region configuration-initialization
    if (storeConfig) StoreConfig(storeConfig)(this.constructor as Class)
    const config: StoreConfigCompleteInfo = cloneObject(this.constructor[STORE_CONFIG_KEY])
    if (!config) throwError(`Store must be provided with store configuration via decorator or via constructor.`)
    config.customStorageApi = this.constructor[STORE_CONFIG_KEY].customStorageApi
    delete this.constructor[STORE_CONFIG_KEY]
    const storeName = config.name
    this._assertStoreNameValid(storeName)
    BaseStore._storeNames.push(storeName)
    DevToolsAdapter.stores[storeName] = this
    if (config.storageType != Storages.custom && config.customStorageApi) {
      logWarn(`Store: "${storeName}" was provided with custom storage api implementation but storage type was not set to custom. Therefore custom storage api implementation will be ignored.`)
      config.customStorageApi = null
    } else if (config.storageType == Storages.custom && !config.customStorageApi) {
      logWarn(`Store: "${storeName}" has storage type set to custom but no custom storage api implementation was provided. Therefore storage type will be set to none.`)
      config.storageType = Storages.none
    }
    config.storageKey = config.storageKey || storeName
    config.objectCompareTypeName = [`Reference`, `Simple`, `Advanced`][config.objectCompareType]
    config.storageTypeName = [`None`, `Local-Storage`, `Session-Storage`, `Custom`][config.storageType]
    this._config = config
    this._storeName = config.name
    this._isResettable = config.isResettable
    this._isSimpleCloning = config.isSimpleCloning
    this._isInstanceHandler = config.isInstanceHandler
    this._objectCompareType = config.objectCompareType
    if (this._config.storageType != Storages.none) {
      this._assertStorageKeyValid(config.storageKey, storeName)
      BaseStore._storageKeys.push(config.storageKey)
    }
    this._storageKey = config.storageKey
    this._storageDebounce = config.storageDebounceTime
    this._storage = this._resolveStorageType(config.storageType, config.customStorageApi)
    this._compare = this._resolveObjectCompareType(config.objectCompareType)
    this._clone = !config.isImmutable ? this._noClone : config.isSimpleCloning ? shallowCloneObject : cloneObject
    this._freeze = config.isImmutable ? deepFreeze : this._noFreeze
    this._stringify = config.stringify
    this._parse = config.parse
    this._handleTypes = handleObjectTypes
    this._cloneError = cloneError
    this._merge = mergeObjects
    const advanced = config.advanced
    if (advanced) {
      if (advanced.clone) this._clone = advanced.clone
      if (advanced.freeze) this._freeze = advanced.freeze
      if (advanced.handleTypes) this._handleTypes = advanced.handleTypes
      if (advanced.compare) this._compare = advanced.compare
      if (advanced.cloneError) this._cloneError = advanced.cloneError
      if (advanced.merge) this._merge = advanced.merge
    }
    //#endregion configuration-initialization
    //#region pre-state initialization procedure
    if (isUndefined(initialValueOrNull)) throwError(`Store: "${storeName}" was provided with "undefined" as an initial state. Pass "null" to initial state if you want to initialize the store later on.`)
    if (isNull(initialValueOrNull)) {
      this._setState({ isLoading: true }, Actions.loading)
    } else {
      this._initializeStore(initialValueOrNull, false)
    }
    //#endregion pre-state initialization procedure
  }

  //#endregion constructor
  //#region helper-methods

  /** @virtual */
  protected _noClone<V extends object | null>(value: V): V {
    return value
  }

  /** @virtual */
  protected _noFreeze<V extends object>(value: V): Readonly<V> {
    return value
  }

  /** @virtual */
  protected _refCompare(objA: object | any[], objB: object | any[]): boolean {
    return objA === objB
  }

  /** @internal */
  protected _resolveObjectCompareType(objectCompareType: ObjectCompareTypes): Compare {
    switch (objectCompareType) {
      case ObjectCompareTypes.advanced: return compareObjects
      case ObjectCompareTypes.simple: return shallowCompareObjects
      case ObjectCompareTypes.reference: return this._refCompare
    }
  }

  /** @internal */
  protected _resolveStorageType(storageType: Storages, customStorageApi: Storage | null): Storage | null {
    switch (storageType) {
      case Storages.none: return null
      case Storages.local: return localStorage
      case Storages.session: return sessionStorage
      case Storages.custom: return customStorageApi
    }
  }

  /** @internal */
  protected _assertStoreNameValid(storeName: string): void {
    if (BaseStore._storeNames.includes(storeName)) {
      throwError(`Store name: "${storeName}"  is not unique.`)
    }
  }

  /** @internal */
  protected _assertStorageKeyValid(storageKey: string, storeName: string): void {
    if (BaseStore._storageKeys.includes(storageKey)) {
      throwError(`Storage key: "${storageKey}" in store: "${storeName}" is not unique.`)
    }
  }

  /** @internal */
  protected _assertInitializable(reject?: (reason: any) => void): boolean | never {
    if (!this._isInitialized) return true
    const errMsg = `Store: "${this._storeName}" has already been initialized. You can hard reset the store if you want to reinitialize it.`
    if (!reject) throwError(errMsg)
    reject(newError(errMsg))
    return false
  }

  //#endregion helper-methods
  //#region utility-methods

  /**
   * Setts an instanced value to be used by the instanced handler for resolving types
   * if "isInstanceHandler" is set to true at the store's configurations.
   * - If an instanced value was not set  by this method, the initial value will be used for resolving types.
   */
  public setInstancedValue(value: S): void {
    this._instancedValue = this._freeze(this._clone(value))
  }

  /**
   * Disposes the observable by completing the observable and removing it from query context list.
   */
  public disposeQueryContext(observable: Observable<T>): void {
    const i = this._queryContextsList.findIndex(x => x.observable == observable)
    if (i > -1) this._queryContextsList.disposeByIndex(i)
  }

  //#endregion utility-methods
  //#region initialization-methods

  /** @internal */
  protected _initializeStore(initialValue: T, isAsync: boolean): void {
    let isValueFromStorage = false
    const storage = this._storage
    if (storage) {
      const storedValue: T | null = this._parse(storage.getItem(this._storageKey))
      if (storedValue) {
        initialValue = this._isInstanceHandler ? this._handleTypes(<T>this._instancedValue || initialValue, storedValue) : storedValue
        isValueFromStorage = true
      }
      this._valueToStorageSub = this._value$
        .pipe(debounceTime(this._storageDebounce))
        .subscribe(value => storage.setItem(this._storageKey, this._stringify(value)))
    }
    if (isFunction(this.onBeforeInit)) {
      const modifiedInitialValue: T | void = this.onBeforeInit(this._clone(initialValue))
      if (modifiedInitialValue) {
        initialValue = this._clone(modifiedInitialValue)
        isValueFromStorage = false
      }
    }
    initialValue = isValueFromStorage ? initialValue : this._clone(initialValue)
    initialValue = this._freeze(initialValue)
    if (this._isResettable) this._initialValue = initialValue
    if (this._isInstanceHandler && !this._instancedValue) {
      if (isArray(initialValue)) {
        if (initialValue[0]) this._instancedValue = initialValue[0]
      } else {
        this._instancedValue = initialValue as Readonly<S>
      }
      if (!this._instancedValue) throwError(`Store: "${this._storeName}" has instanced handler configured to true but couldn't resolve an instanced value.`)
    }
    this._setState(() => this._clone(initialValue), isAsync ? Actions.initAsync : Actions.init, { isLoading: false })
    assert(this._value, `Store: "${this._storeName}" state could not be set durning initialization.`)
    if (isFunction(this.onAfterInit)) {
      const modifiedValue: T | void = this.onAfterInit(this._clone(this._value))
      if (modifiedValue) this._setState(() => this._clone(modifiedValue), Actions.afterInitUpdate)
    }
    this._isInitialized = true
  }

  /** @internal */
  protected _initializeLazily(): void {
    const lazyInitContext: LazyInitContext<any> | null = this._lazyInitContext
    if (lazyInitContext && !lazyInitContext.isCanceled) {
      this.initializeAsync(lazyInitContext.value)
        .then(d => lazyInitContext.resolve(d))
        .catch(e => lazyInitContext.reject(e))
      this._lazyInitContext = null
    }
  }

  /**
   * Method used for delayed initialization.
   */
  public initialize(initialValue: T): void {
    this._assertInitializable()
    this._initializeStore(initialValue, false)
  }

  /**
   * Method for asynchronous initialization.
   * - In case of an observable, only the finite value will be used.
   */
  public initializeAsync(promise: Promise<T>): Promise<void>
  public initializeAsync(observable: Observable<T>): Promise<void>
  public initializeAsync(promiseOrObservable: Promise<T> | Observable<T>): Promise<void>
  public initializeAsync(promiseOrObservable: Promise<T> | Observable<T>): Promise<void> {
    const asyncInitPromiseContext = createPromiseContext()
    this._asyncInitPromiseContext = asyncInitPromiseContext
    asyncInitPromiseContext.promise = new Promise((resolve, reject) => {
      if (!this._assertInitializable(reject)) return
      if (isObservable(promiseOrObservable)) promiseOrObservable = promiseOrObservable.toPromise()
      promiseOrObservable.then(r => {
        if (asyncInitPromiseContext.isCancelled) return
        if (!this._assertInitializable(reject)) return
        if (isFunction(this.onAsyncInitSuccess)) {
          const modifiedResult = this.onAsyncInitSuccess(r)
          if (modifiedResult) r = modifiedResult
        }
        this._initializeStore(r, true)
      }).catch(e => {
        if (asyncInitPromiseContext.isCancelled) return
        if (isFunction(this.onAsyncInitError)) {
          e = this.onAsyncInitError(e)
        }
        if (e) return reject(e)
      }).finally(resolve)
    })
    return asyncInitPromiseContext.promise
  }

  /**
   * Method for lazy initialization.
   * - will initialize the store only after the first queryable request is made.
   * - In case of an observable, only the finite value will be used.
   */
  public initializeLazily(promise: Promise<T>): Promise<void>
  public initializeLazily(observable: Observable<T>): Promise<void>
  public initializeLazily(promiseOrObservable: Promise<T> | Observable<T>): Promise<void>
  public initializeLazily(promiseOrObservable: Promise<T> | Observable<T>): Promise<void> {
    if (this._queryContextsList.length) return this.initializeAsync(promiseOrObservable)
    return new Promise((resolve, reject) => {
      if (!this._assertInitializable(reject)) return
      if (this._lazyInitContext) {
        reject(`Store: "${this._storeName}" has multiple calls for lazy initialization.`)
        return
      }
      this._lazyInitContext = {
        value: promiseOrObservable,
        isCanceled: false,
        resolve,
        reject,
      }
    })
  }

  //#endregion initialization-methods
  //#region state-methods

  /** @internal */
  protected _setState(
    valueFnOrState: ((stateValue: Readonly<T> | null) => T) | Partial<State<T, E>>,
    actionName: string | Actions,
    stateExtension?: Partial<State<T, E>>
  ): void {
    if (this.isDestroyed) return
    if (isFunction(valueFnOrState)) {
      valueFnOrState = {
        value: this._freeze(valueFnOrState(this._value))
      }
    }
    this._lastAction = actionName
    this._state = objectAssign(this._state, valueFnOrState, stateExtension || null)
    if (isDevTools()) {
      DevToolsAdapter.stateChange$.next({
        storeName: this._storeName,
        state: this._state,
        actionName
      })
    }
  }

  //#endregion state-methods
  //#region reset-dispose-destroy-methods

  /**
   * Resets the state's value to it's initial value.
   */
  public reset(actionName?: string): void | never {
    if (this.isPaused) return
    this._setState(value => {
      const initialValue = this._initialValue
      assert(value && initialValue && !this.isLoading, `Store: "${this._storeName}" can't be reseted before it was initialized`)
      assert(this._isResettable, `Store: "${this._storeName}" is not configured as resettable.`)
      let modifiedInitialValue: T | void
      if (isFunction(this.onReset)) modifiedInitialValue = this.onReset(this._clone(initialValue), value)
      return this._clone(modifiedInitialValue || initialValue)
    }, actionName || Actions.reset)
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
      return Promise.reject(new Error(`Store: "${this._storeName}" is not configured as resettable.`))
    }
    this._setState({ isHardResettings: true }, Actions.hardResetting)
    return this._hardResetOrDestroy(() => {
      this._queryContextsList.forEach(x => x.wasHardReset = true)
      this._partialHardReset(Actions.loading)
    })
  }

  /**
   * There is no reason to use this method other then debugging.
   * This method will do everything that hard and also:
   * - Remove the store from DevTools.
   * - Complete all source observables.
   * - Dispose all query contexts.
   */
  public destroy(): Promise<this> {
    return this._hardResetOrDestroy(() => {
      objectKeys(this).forEach(key => {
        const prop = this[key]
        if (prop instanceof Subject) prop.complete()
      })
      this._queryContextsList.disposeAll()
      this._partialHardReset(Actions.destroy, /*isLoading*/ false)
      const storeName = this._storeName
      delete DevToolsAdapter.stores[storeName]
      delete DevToolsAdapter.states[storeName]
      delete DevToolsAdapter.values[storeName]
      this._isDestroyed = true
    })
  }

  protected _partialHardReset(action: Actions, isLoading: boolean = true): void {
    if (this._valueToStorageSub) this._valueToStorageSub.unsubscribe()
    if (this._storage) this._storage.removeItem(this._storageKey)
    this._initialValue = null
    this._instancedValue = null
    this._isInitialized = false
    if (this._lazyInitContext) this._lazyInitContext.isCanceled = true
    this._lazyInitContext = null
    this._setState({
      value: null,
      error: null,
      isPaused: false,
      isHardResettings: false,
      isLoading,
    }, action)
  }

  protected _hardResetOrDestroy(executor: () => void): Promise<this> {
    const asyncInitPromiseContext = this._asyncInitPromiseContext
    const initializeAsyncPromiseState: Promise<void | PromiseStates> =
      (asyncInitPromiseContext && asyncInitPromiseContext.promise) ?
        getPromiseState(asyncInitPromiseContext.promise) :
        Promise.resolve()
    return new Promise(resolve => {
      const callback = () => {
        executor()
        resolve(this)
      }
      initializeAsyncPromiseState.then(state => {
        if (asyncInitPromiseContext) asyncInitPromiseContext.isCancelled = state === PromiseStates.pending
        callback()
      }).catch(callback)
    })
  }

  //#endregion reset-dispose-destroy-methods
  //#region hooks

  /**
   * @virtual Override to use `onBeforeInit` hook.
   * - Will be called before the store has completed the initialization.
   * - Allows state's value modification before the initialization is complete.
   */
  protected onBeforeInit?(nextState: T): void | T

  /**
   * @virtual Override to use `onAfterInit` hook.
   * - Will be called once the store has completed initialization.
   * - Allows state's value modification after initialization.
   */
  protected onAfterInit?(currState: T): void | T

  /**
   * @virtual Override to use `onAsyncInitError` hook.
   * - Will be called if there is an error during async initialization.
   * - Allows error manipulation.
   * - If the method returns an error, it will bubble via promise rejection.
   * - If method returns void, the error will will not bubble further.
   */
  protected onAsyncInitError?(error: E): void | E

  /**
   * @virtual Override to use `onAsyncInitSuccess` hook.
   * - Will be called once data is received during async initialization.
   * - Allows data manipulations like mapping and etc.
   */
  protected onAsyncInitSuccess?(result: T): void | T

  /**
   * @virtual Override to use `onUpdate` hook.
   * - Will be called after the update method has merged the changes with the given state and just before this state is set.
   * - Allows future state modification.
   */
  protected onUpdate?(nextState: T, currState: Readonly<T>): void | T

  /**
   * @virtual Override to use `onOverride` hook.
   * - Will be called after the override method and just before the new state is set.
   * - Allows future state modification.
   */
  protected onOverride?(nextState: T, prevState: Readonly<T>): void | T

  /**
   * @virtual Override to use `onReset` hook.
   * - Will be called after the reset method and just before the new state is set.
   * - Allows future state modification.
   */
  protected onReset?(nextState: T, currState: Readonly<T>): void | T

  //#endregion hooks
}
