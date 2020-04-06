import { Store, StoreConfig } from 'lbrx'
import { AllStoreHooks } from 'types'

export class StoresFactory {

	public static createTestStore<T extends object, E = any>(
		initialState: T | null
	): Store<T, E> & AllStoreHooks<T, E>
	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		storeName: string
	): Store<T, E> & AllStoreHooks<T, E>
	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		withHooks: true
	): Store<T, E> & AllStoreHooks<T, E>
	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		withHooks: false
	): Store<T, E>
	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		storeName: string,
		withHooks: true
	): Store<T, E> & AllStoreHooks<T, E>
	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		storeName: string,
		withHooks: false
	): Store<T, E>
	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		storeNameOrWithHooks?: string | boolean,
		withHooks?: boolean,
	): Store<T, E> & AllStoreHooks<T, E> | Store<T, E> {
		const storeName = typeof storeNameOrWithHooks == 'string' ? storeNameOrWithHooks : 'TEST-STORE'
		withHooks = typeof withHooks == 'boolean' ? withHooks : typeof storeNameOrWithHooks == 'boolean' ? storeNameOrWithHooks : false
		if (withHooks) {
			@StoreConfig({
				name: storeName
			})
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
			@StoreConfig({
				name: storeName
			})
			class TestStore extends Store<T, E> {
				constructor() {
					super(initialState)
				}
			}
			return new TestStore()
		}
	}
}
