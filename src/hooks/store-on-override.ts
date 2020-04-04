
/**
 * Implement to use onOverride hook.
 */
export interface StoreOnOverride<T = object> {

	/**
	 * Will be triggered on every state's override just before the new state's value is set.
	 * - Allows new state modification just before it becomes the new state's value.
	 */
	onOverride(newState: T, oldState: Readonly<T>): T | void
}
