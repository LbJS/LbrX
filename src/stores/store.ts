import { DevToolsStores } from '../dev-tools/dev-tools-stores'
import { BehaviorSubject, timer, Observable, throwError } from 'rxjs'
import { debounce, map, distinctUntilChanged, filter } from 'rxjs/operators'
import { StoreConfigOptions, Storages, STORE_CONFIG_KEY } from './config'
import { StoreDevObject } from '../dev-tools/store-dev-object'
import { isNull, objectAssign, stringify, parse, deepFreeze, isFunction, isObject, compareObjects, instanceHandler, cloneObject } from 'lbrx/helpers'
import { isDev, isDevTools } from 'lbrx/mode'

export class Store<T extends object> {

	public readonly isLoading$ = new BehaviorSubject<boolean>(false)
	public get isLoading(): boolean {
		return this.isLoading$.getValue()
	}

	public error: string | object | null = null
	public get isError(): boolean {
		return !!this.error
	}

	private readonly _state$ = new BehaviorSubject<T | null>(null)
	private _state!: Readonly<T>
	private set state(value: T) {
		this._state = value
		this._state$.next(value)
	}
	public get value(): T {
		return cloneObject(this._state)
	}
	private _initialState: T | null = null
	public get initialValue(): T {
		return this._initialState as T
	}

	#config!: StoreConfigOptions
	public get config(): StoreConfigOptions {
		return this.#config
	}
	#storeName!: string
	#isResettable!: boolean
	#doObjectCompare!: boolean
	#storage!: Storage | null
	#storageDelay!: number

	private get storeDevObject(): StoreDevObject {
		return { name: this.#storeName, state: cloneObject(this._state as T) }
	}

	constructor(initialState: null, storeConfig?: StoreConfigOptions)
	// tslint:disable-next-line: unified-signatures
	constructor(initialState: Partial<T>, storeConfig?: StoreConfigOptions)
	constructor(
		initialStateOrNull: Partial<T> | null,
		storeConfig?: StoreConfigOptions,
	) {
		this._initializeConfig(storeConfig)
		if (!this.config) throwError(`Store must be decorated with the "@StoreConfig" decorator or store config must supplied via the store's constructor!`)
		if (isDevTools) DevToolsStores.Stores[this.#storeName] = this
		if (isNull(initialStateOrNull)) {
			this.isLoading$.next(true)
			isDevTools && DevToolsStores.LoadingStore$.next(this.#storeName)
		} else {
			this._initializeStore(initialStateOrNull as T)
		}
	}

	private _initializeConfig(storeConfig?: StoreConfigOptions): void {
		this.#config = storeConfig ? storeConfig : this.constructor[STORE_CONFIG_KEY]
		this.#storeName = this.#config.name
		this.#isResettable = !!this.#config.isResettable
		this.#doObjectCompare = !!this.#config.doObjectCompare
		this.#storage = (() => {
			if (!this.config.storage) return null
			return this.config.storage.type === Storages.local ?
				localStorage :
				this.config.storage.type === Storages.session ?
					sessionStorage :
					null
		})()
		this.#storageDelay = this.#config.storage?.debounceTime || 0
	}

	private _initializeStore(initialState: T): void {
		this.onBeforeInit()
		if (this.#isResettable) {
			this._initialState = cloneObject(initialState)
		}
		const storage = this.#storage
		let storedState: null | T = null
		if (storage) {
			this._state$.pipe(debounce(() => timer(this.#storageDelay)))
				.subscribe(state => storage.setItem(this.#storeName, stringify(state)))
			storedState = parse(storage.getItem(this.#storeName))
			if (storedState) storedState = instanceHandler(initialState, storedState)
		}
		this._setState(() => storedState || initialState)
		isDevTools && DevToolsStores.InitStore$.next(this.storeDevObject)
		this.onAfterInit(this._state)
	}

	private _setState(newStateFn: (state: Readonly<T>) => T): void {
		this.state = isDev ? deepFreeze(newStateFn(this._state)) : newStateFn(this._state)
	}

	public initialize(initialState: Partial<T>): void | never {
		if (!this.isLoading) {
			isDev && throwError("Can't initialize store that's already been initialized and its not in LOADING state!")
			return
		}
		this._initializeStore(initialState as T)
		this.isLoading$.next(false)
	}

	/**
	 *
	 * @example
	 *
	 *  this.store.update({ key: value })
	 */
	public update(state: Partial<T>, updateName?: string): void
	/**
	 *
	 * Update the store's value
	 *
	 * @example
	 *
	 * this.store.update(state => {
	 *   return {...}
	 * })
	 */
	// tslint:disable-next-line: unified-signatures
	public update(stateCallback: (state: Readonly<T>) => Partial<T>, updateName?: string): void
	public update(
		stateOrCallback: ((state: Readonly<T>) => Partial<T>) | Partial<T>,
		updateName?: string
	): void {
		if (this.isLoading) {
			isDev && throwError(`Can't update ${this.#storeName} while it's in loading state.`)
			return
		}
		this._setState(state => {
			const newPartialState = isFunction(stateOrCallback) ? stateOrCallback(state) : stateOrCallback
			const clonedState = cloneObject(state)
			let newState = objectAssign(clonedState, newPartialState)
			newState = instanceHandler(state, newState)
			this.onUpdate(state, newState)
			return newState
		})
		isDevTools && DevToolsStores.UpdateStore$.next(updateName ? objectAssign(this.storeDevObject, { updateName }) : this.storeDevObject)
	}

	public override(state: T): void {
		if (this.isLoading) {
			isDev && throwError(`Can't override ${this.#storeName} while it's in loading state.`)
			return
		}
		this.onUpdate(this._state, state)
		this.onOverride(this._state, state)
		this._setState(() => instanceHandler(this._state, state))
		isDev && DevToolsStores.OverrideStore$.next(this.storeDevObject)
	}

	public reset(): void | never {
		if (this.isLoading) {
			isDev && throwError(`Can't reset ${this.#storeName} while it's in loading state.`)
			return
		} else if (!this.#isResettable) {
			isDev && throwError(`Store: ${this.#storeName} is not configured as resettable.`)
		} else {
			this._setState(state => {
				this.onReset(state, this._initialState as T)
				return cloneObject(this._initialState as T)
			})
			isDevTools && DevToolsStores.ResetStore$.next({ name: this.#storeName, state: cloneObject(this._initialState as T) })
		}
	}

	public select(): Observable<T>
	public select<R>(project: (state: T) => R): Observable<R>
	public select<R>(project?: (state: T) => R): Observable<T | R> {
		return this._state$.asObservable()
			.pipe(
				filter<T>(x => !!x),
				map<T, R | T>(project || (x => x)),
				map(x => isObject(x) ? cloneObject(x) : x),
				distinctUntilChanged((prev, curr) => {
					if (isObject(prev) && this.#doObjectCompare) return compareObjects(prev, curr)
					return prev === curr
				}),
			)
	}

	/**
	 * @Override
	 */
	protected onBeforeInit(): void { }

	/**
	 * @Override
	 */
	protected onAfterInit(state: T): void { }

	/**
	 * @Override
	 */
	protected onOverride(oldState: T, newState: T): void { }

	/**
	 * @Override
	 */
	protected onUpdate(oldState: T, newState: T): void { }

	/**
	 * @Override
	 */
	protected onReset(oldState: T, initialState: T): void { }
}
