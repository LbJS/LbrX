import { Store, StoreConfig, StoreConfigOptions } from 'lbrx'
import { AllStoreHooks } from 'types'

export class StoresFactory {

	public static createStore<T extends object, E = any>(
		initialState: T | null
	): Store<T, E> & AllStoreHooks<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		storeName: string
	): Store<T, E> & AllStoreHooks<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		options: StoreConfigOptions
	): Store<T, E> & AllStoreHooks<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		withHooks: true
	): Store<T, E> & AllStoreHooks<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		withHooks: false
	): Store<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		storeName: string,
		withHooks: true
	): Store<T, E> & AllStoreHooks<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		storeName: string,
		withHooks: false
	): Store<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		options: StoreConfigOptions,
		withHooks: true
	): Store<T, E> & AllStoreHooks<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		options: StoreConfigOptions,
		withHooks: false
	): Store<T, E>
	public static createStore<T extends object, E = any>(
		initialState: T | null,
		storeNameOrWithHooksOrOptions?: string | boolean | StoreConfigOptions,
		withHooks?: boolean,
	): Store<T, E> & AllStoreHooks<T, E> | Store<T, E> {
		const storeName = typeof storeNameOrWithHooksOrOptions == 'string' ? storeNameOrWithHooksOrOptions : 'TEST-STORE'
		const options: StoreConfigOptions = typeof storeNameOrWithHooksOrOptions == 'object' && storeNameOrWithHooksOrOptions ?
			storeNameOrWithHooksOrOptions : { name: storeName }
		withHooks = typeof withHooks == 'boolean' ?
			withHooks : typeof storeNameOrWithHooksOrOptions == 'boolean' ?
				storeNameOrWithHooksOrOptions : false
		if (withHooks) {
			@StoreConfig(options)
			class TestStore extends Store<T, E> implements AllStoreHooks<T, E> {
				constructor() {
					super(initialState)
				}
				onBeforeInit(nextState: T): void | T { }
				onAfterInit(currState: T): void | T { }
				onAsyncInitSuccess(result: T): void | T { }
				onAsyncInitError(error: E): void | E { }
				onOverride(nextState: T, currState: Readonly<T>): void | T { }
				onReset(nextState: T, currState: Readonly<T>): void | T { }
				onUpdate(nextState: T, currState: Readonly<T>): void | T { }
			}
			return new TestStore()
		} else {
			@StoreConfig(options)
			class TestStore extends Store<T, E> {
				constructor() {
					super(initialState)
				}
			}
			return new TestStore()
		}
	}

	public static createStoreWithNoConfig<T extends object, E = any>(initialState: T | null): Store<T, E> {
		class TestStore extends Store<T, E> {
			constructor() {
				super(initialState)
			}
		}
		return new TestStore()
	}
}
