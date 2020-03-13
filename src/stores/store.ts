import { DevToolsStores } from "../dev-tools/dev-tools-stores"
import { BehaviorSubject, timer, Observable } from "rxjs"
import { debounce, map, distinctUntilChanged, filter } from "rxjs/operators"
import { StoreConfigOptions, Storages, STORE_CONFIG_KEY } from "./config"
import { StoreDevObject } from "../dev-tools/store-dev-object"
import { isNull, objectAssign, isClass, stringify, parse, deepFreeze, isFunction, isObject, compareObjects } from "../helpers"
import { cloneObject } from "../helpers/helper-functions/clone-object"
import { isDev } from "src/mode"

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

	private _config!: StoreConfigOptions
	public get config(): StoreConfigOptions {
		return this._config
	}
	public get storeName(): string {
		return this.config.storeName
	}
	private get isResettable(): boolean {
		return !!this.config.isResettable
	}
	private get storage(): Storage | null {
		return this.config.storage === Storages.local ?
			localStorage :
			this.config.storage === Storages.session ?
				sessionStorage :
				null
	}
	private get storageDelay(): number {
		return !!this.config.storageDelay ? this.config.storageDelay : 0
	}
	private get doObjectCompare(): boolean {
		return !!this.config.doObjectCompare
	}

	private get storeDevObject(): StoreDevObject {
		return { name: this.storeName, state: this._state }
	}

	constructor(initialState: null, storeConfig?: StoreConfigOptions)
	// tslint:disable-next-line: unified-signatures
	constructor(initialState: Partial<T>, storeConfig?: StoreConfigOptions)
	constructor(
		initialStateOrNull: Partial<T> | null,
		storeConfig?: StoreConfigOptions,
	) {
		this._config = storeConfig ? storeConfig : this.constructor[STORE_CONFIG_KEY]
		if (!this.config) throw new Error(`Store must be decorated with the "@StoreConfig" decorator or store config must supplied via the store's constructor!`)
		if (isDev) DevToolsStores.Stores[this.storeName] = this
		if (isNull(initialStateOrNull)) {
			this.isLoading$.next(true)
			isDev && DevToolsStores.LoadingStore$.next(this.storeName)
		} else {
			this._initializeStore(initialStateOrNull as T)
		}
	}

	private _initializeStore(initialState: T): void {
		this.onBeforeInit()
		if (this.isResettable) {
			this._initialState = objectAssign(isClass(initialState) ? new (initialState as any).constructor() : {}, initialState)
		}
		const storage = this.storage
		let storedState: null | T = null
		if (storage) {
			this._state$.pipe(debounce(() => timer(this.storageDelay)))
				.subscribe(state => storage.setItem(this.storeName, stringify(state)))
			storedState = parse(storage.getItem(this.storeName))
			if (storedState) storedState = objectAssign(isClass(initialState) ? new (initialState as any).constructor() : {}, storedState)
		}
		this._setState(() => storedState || initialState)
		isDev && DevToolsStores.InitStore$.next(this.storeDevObject)
		this.onAfterInit(this._state)
	}

	private _setState(newStateFn: (state: Readonly<T>) => T): void {
		this.state = isDev ? deepFreeze(newStateFn(this._state)) : newStateFn(this._state)
	}

	public initialize(initialState: Partial<T>): void | never {
		if (isDev && !this.isLoading) {
			throw new Error("Can't initialize store that's already been initialized and its not in LOADING state!")
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
	public update(state: Partial<T>, updateName?: string): void;
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
	public update(stateCallback: (state: Readonly<T>) => Partial<T>, updateName?: string): void;
	public update(
		stateOrCallback: ((state: Readonly<T>) => Partial<T>) | Partial<T>,
		updateName?: string
	): void {
		if (this.isLoading) {
			if (isDev) throw new Error(`Can't update ${this.storeName} while it's in loading state.`)
			return
		}
		this._setState(state => {
			const newPartialState = isFunction(stateOrCallback) ? stateOrCallback(state) : stateOrCallback
			const newState = objectAssign(isClass(state) ? new (state as any).constructor() : {}, { ...state }, newPartialState)
			this.onUpdate(this._state, newState)
			return newState
		})
		isDev && DevToolsStores.UpdateStore$.next(updateName ? objectAssign(this.storeDevObject, { updateName }) : this.storeDevObject)
	}

	public override(state: T): void {
		if (this.isLoading) {
			if (isDev) throw new Error(`Can't override ${this.storeName} while it's in loading state.`)
			return
		}
		this.onUpdate(this._state, state)
		this.onOverride(this._state, state)
		this._setState(() => state)
		isDev && DevToolsStores.OverrideStore$.next(this.storeDevObject)
	}

	public reset(): void | never {
		if (this.isLoading) {
			if (isDev) throw new Error(`Can't reset ${this.storeName} while it's in loading state.`)
			return
		} else if (!this.isResettable) {
			if (isDev) throw new Error(`Store: ${this.storeName} is not configured as resettable.`)
		} else {
			this._setState(state => {
				this.onReset(state, this._initialState as T)
				return objectAssign(isClass<T>(state) ? new (state as any).constructor() : {}, { ...this._initialState })
			})
			isDev && DevToolsStores.ResetStore$.next({ name: this.storeName, state: { ...this._initialState } })
		}
	}

	public select(): Observable<T>
	public select<R>(project: (state: T) => R): Observable<R>
	public select<R>(project?: (state: T) => R | T): Observable<T | R> {
		return this._state$.asObservable()
			.pipe(
				filter(x => !!x),
				map(project || ((x: T) => x)),
				map(x => isObject(x) ? cloneObject(x) : x),
				distinctUntilChanged((prev, curr) => {
					if (isObject(prev)) return this.doObjectCompare ? compareObjects(prev, curr) : false
					return prev !== curr
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
