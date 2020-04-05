import { Store, StoreConfig } from 'lbrx'
import { AllStoreHooks } from 'types'

export class StoresFactory {

	public static createTestStore<T extends object, E = any>(
		initialState: T | null,
		storeName: string = 'TEST-STORE',
	): Store<T, E> & AllStoreHooks<T, E> {
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
