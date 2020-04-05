
/**
 * Implement to use onReset hook.
 */
export interface StoreOnReset<T = object> {

	/**
	 * Will be triggered on every state's reset just before the initial value is set.
	 * - Allows the initial state's value modification just before it becomes the new state's value.
	 */
	onReset(initialState: T, currentState: Readonly<T>): T | void
}
