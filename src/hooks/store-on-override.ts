
/**
 * Implement to use onOverride hook.
 */
export interface StoreOnOverride {

	/**
	 * Will be triggered on every state's override just before the new state's value is set.
	 * - Allows new state modification just before it becomes the new state's value.
	 */
	onOverride(newState: object, oldState: Readonly<object>): object | void
}
