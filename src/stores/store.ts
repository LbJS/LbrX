import { DevToolsSubjects } from '../dev-tools/dev-tools-subjects'
import { BehaviorSubject, timer, Observable, throwError } from 'rxjs'
import { debounce, map, distinctUntilChanged, filter } from 'rxjs/operators'
import { StoreConfigOptions, Storages, STORE_CONFIG_KEY, ObjectCompareTypes, StoreConfigOptionsInfo } from './config'
import { DevToolsDataStruct } from '../dev-tools/store-dev-object'
import { isNull, objectAssign, stringify, parse, deepFreeze, isFunction, isObject, compareObjects, instanceHandler, cloneObject, simpleCompareObjects, simpleCloneObject, mergeObjects, logError } from 'lbrx/helpers'
import { isDev, isDevTools } from 'lbrx/mode'
import { GlobalErrorStore } from './global-error-store'

// tslint:disable: no-redundant-jsdoc
// tslint:disable: unified-signatures

/**
 * @example
 * const createUiState: UiState = () => {
 * 	return {...}
 * }
 *
 * `@`StoreConfig({
 * 	name: 'UI-STORE'
 * })
 * export class UiStore extends Store<UiState> {
 *
 * 	constructor() {
 * 		super(createUiState())
 * 	}
 * }
 */
export class Store<T extends object> {

	//#region loading-state

	/**
	 * Weather or not the store is in it's loading state.
	 * - If the initial value at the constructor is null,
	 * the store will automatically set it self to a loading state and
	 * then will set it self to none loading state after it wil be initialized.
	 * - While the store is in loading state, no values will be emitted to state's subscribers.
	 */
	public readonly isLoading$ = new BehaviorSubject<boolean>(false)
	/**
	 * Returns the value from isLoading$.
	 */
	public get isLoading(): boolean {
		return this.isLoading$.getValue()
	}

	//#endregion loading-state
	//#region error-api

	private readonly _error$ = new BehaviorSubject<any>(null)
	/**
	 * Store's error state.
	 */
	public get error$(): Observable<any> {
		return this._error$.asObservable()
	}
	/**
	 * @get Returns the value from error$
	 * @set Sets store's error state and also sets global error state.
	 */
	public get error(): any {
		return this._error$.getValue()
	}
	public set error(value: any) {
		this._error$.next(value)
		GlobalErrorStore.setGlobalError(value)
	}

	//#endregion error-api
	//#region state-properties

	private readonly _state$ = new BehaviorSubject<T | null>(null)
	private _state!: Readonly<T>
	private set state(value: T) {
		this._state = value
		this._state$.next(value)
	}
	/**
	 * Returns stores current state's value.
	 */
	public get value(): T {
		return this._state ? this._clone(this._state) : this._state
	}

	private _initialState!: Readonly<T>
	/**
	 * Returns stores initial state's value.
	 */
	public get initialValue(): Readonly<T> | null {
		return this._clone(this._initialState)
	}

	//#endregion state-properties
	//#region config

	private _config!: StoreConfigOptionsInfo
	/**
	 * Returns store's active configuration.
	 */
	public get config(): StoreConfigOptionsInfo {
		return this._config
	}
	private _storeName!: string
	private _isResettable!: boolean
	private _isSimpleCloning!: boolean
	private _objectCompareType!: ObjectCompareTypes
	private _storage!: Storage | null
	private _storageDebounce!: number
	private _storageKey!: string
	private _clone!: (obj: T) => T
	private _compare!: (objA: T, pbjB: T) => boolean

	private get devData(): DevToolsDataStruct {
		return { name: this._storeName, state: this._clone(this._state) }
	}

	//#endregion config
	//#region hooks

	/**
	 * Will be triggered only once, before the store would set it's initial state's value.
	 * - Allows state's value modification before initialization.
	 * @override
	 */
	protected onBeforeInit?: (() => T | void) | ((initialState: T) => T | void)
	/**
	 * Will be triggered only once, after the store would complete the initialization.
	 * - Allows state's value modification after initialization.
	 * @override
	 */
	protected onAfterInit?: (() => T | void) | ((state: T) => T | void)
	/**
	 * Will be triggered on every update just before the new state's value is set,
	 * but after the new value is ready.
	 * - Allows new state modification just before it becomes the new state's value.
	 * @override
	 */
	protected onUpdate?: (() => T | void) | ((newState: T) => T | void) | ((newState: T, oldState: Readonly<T>) => T | void)
	/**
	 * Will be triggered on every state's override just before the new state's value is set.
	 * - Allows new state modification just before it becomes the new state's value.
	 * @override
	 */
	protected onOverride?: (() => T | void) | ((newState: T) => T | void) | ((newState: T, oldState: Readonly<T>) => T | void)
	/**
	 * Will be triggered on every state's reset just before the initial value is set.
	 * - Allows the initial state's value modification just before it becomes the new state's value.
	 * @override
	 */
	protected onReset?: (() => T | void) | ((initialState: T) => T | void) | ((initialState: T, currentState: Readonly<T>) => T | void)

	//#endregion hooks
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
	constructor(initialStateOrNull: T | null, storeConfig?: StoreConfigOptions) {
		this._main(initialStateOrNull, storeConfig)
	}

	//#endregion constructor
	//#region private-section

	private _main(initialStateOrNull: T | null, storeConfig?: StoreConfigOptions): void {
		this._initializeConfig(storeConfig)
		if (!this.config) throwError(`Store must be decorated with the "@StoreConfig" decorator or store config must supplied via the store's constructor!`)
		if (isDevTools) DevToolsSubjects.stores[this._storeName] = this
		if (isNull(initialStateOrNull)) {
			this.isLoading$.next(true)
			isDevTools && DevToolsSubjects.loadingEvent$.next(this._storeName)
		} else {
			this._initializeStore(initialStateOrNull)
		}
	}

	private _initializeConfig(storeConfig?: StoreConfigOptions): void {
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
				case ObjectCompareTypes.reference: return (a: T, b: T) => a === b
			}
		})()
		this._config.objectCompareTypeName = ['Reference', 'Simple', 'Advanced'][this._objectCompareType]
		this._storage = (() => {
			switch (this._config.storageType) {
				case Storages.none: return null
				case Storages.local: return localStorage
				case Storages.session: return sessionStorage
				case Storages.custom: return this._config.customStorage ? this._config.customStorage : null
			}
		})()
		this._config.storageTypeName = [
			'none',
			'Local-Storage',
			'Session-Storage',
			this._config.customStorage ? 'Custom' : 'none'
		][this._config.storageType]
		this._storageDebounce = this._config.storageDebounceTime
		this._storageKey = this._config.storageKey
	}

	private _initializeStore(initialState: T): void {
		if (this.onBeforeInit) {
			const modifiedInitialState: T | void = this.onBeforeInit(initialState)
			if (modifiedInitialState) initialState = modifiedInitialState
		}
		this._initialState = deepFreeze(this._clone(initialState))
		const storage = this._storage
		let storedState: null | T = null
		if (storage) {
			this._state$
				.pipe(debounce(() => timer(this._storageDebounce)))
				.subscribe(state => storage.setItem(this._storageKey, stringify(state)))
			storedState = parse(storage.getItem(this._storageKey))
			if (storedState && !this._isSimpleCloning) storedState = instanceHandler(initialState, storedState)
		}
		this._setState(() => storedState || initialState)
		if (this.onAfterInit) {
			const modifiedState: T | void = this.onAfterInit(this._clone(this._state))
			if (modifiedState) this._setState(() => modifiedState)
		}
		isDevTools && DevToolsSubjects.initEvent$.next(this.devData)
	}

	private _setState(newStateFn: (state: Readonly<T>) => T): void {
		this.state = isDev ? deepFreeze(newStateFn(this._state)) : newStateFn(this._state)
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
			isDev && throwError("Can't initialize store that's already been initialized or its not in LOADING state!")
			return
		}
		this._initializeStore(initialState)
		this.isLoading$.next(false)
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
	public update(
		stateOrCallback: ((state: Readonly<T>) => Partial<T>) | Partial<T>,
		updateName?: string
	): void {
		if (this.isLoading) {
			logError(`Can't update ${this._storeName} while it's in loading state.`)
			return
		}
		this._setState(state => {
			const newPartialState = isFunction(stateOrCallback) ? stateOrCallback(state) : stateOrCallback
			const clonedState = this._clone(state)
			let newState = mergeObjects(clonedState, newPartialState)
			if (!this._isSimpleCloning) newState = instanceHandler(this._initialState, newState)
			if (this.onUpdate) {
				const newModifiedState: T | void = this.onUpdate(newState, state)
				if (newModifiedState) newState = newModifiedState
			}
			return newState
		})
		isDevTools && DevToolsSubjects.updateEvent$.next(updateName ? objectAssign(this.devData, { updateName }) : this.devData)
	}

	/**
	 * Overrides the state's value completely, without merging.
	 */
	public override(state: T): void {
		if (this.isLoading) {
			logError(`Can't override ${this._storeName} while it's in loading state.`)
			return
		}
		if (this.onOverride) {
			const modifiedState: T | void = this.onOverride(state, this._state)
			if (modifiedState) state = modifiedState
		}
		this._setState(() => this._isSimpleCloning ? state : instanceHandler(this._initialState, state))
		isDev && DevToolsSubjects.overrideEvent$.next(this.devData)
	}

	/**
	 * Resets the store's state to it's initial value.
	 */
	public reset(): void | never {
		if (this.isLoading) {
			logError(`Can't reset ${this._storeName} while it's in loading state.`)
			return
		} else if (!this._isResettable) {
			const errMsg = `Store: ${this._storeName} is not configured as resettable.`
			isDev ? throwError(errMsg) : logError(errMsg)
		} else {
			this._setState(state => {
				let modifiedInitialState: T | void
				if (this.onReset) modifiedInitialState = this.onReset(this._initialState, state)
				return this._clone(modifiedInitialState || this._initialState)
			})
			isDevTools && DevToolsSubjects.resetEvent$.next({ name: this._storeName, state: this._clone(this._initialState) })
		}
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
	public select(): Observable<T>
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
	public select<R>(project: (state: T) => R): Observable<R>
	public select<R>(project?: (state: T) => R): Observable<T | R> {
		return this._state$.asObservable()
			.pipe(
				filter<T>(x => !!x && !this.isLoading),
				map<T, R | T>(project || (x => x)),
				map(x => isObject(x) ? this._clone(x) : x),
				distinctUntilChanged((prev, curr) => {
					if (isObject(prev) && isObject(curr)) return this._compare(prev, curr)
					return prev === curr
				}),
			)
	}

	//#endregion public-api
}
