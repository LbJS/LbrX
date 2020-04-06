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
		noHooks: boolean
	): Store<T, E> & AllStoreHooks<T, E> | Store<T, E>
	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		storeName: string,
		noHooks: boolean
	): Store<T, E> & AllStoreHooks<T, E> | Store<T, E>
	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		storeNameOrNoHooks?: string | boolean,
		noHooks?: boolean,
	): Store<T, E> & AllStoreHooks<T, E> | Store<T, E> {
		const storeName = typeof storeNameOrNoHooks == 'string' ? storeNameOrNoHooks : 'TEST-STORE'
		noHooks = typeof noHooks == 'boolean' ? noHooks : typeof storeNameOrNoHooks == 'boolean' ? storeNameOrNoHooks : false
		if (noHooks) {
			@StoreConfig({
				name: storeName
			})
			class TestStore extends Store<T, E> {
				constructor() {
					super(initialState)
				}
			}
			return new TestStore()
		} else {
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
		}
	}
}
