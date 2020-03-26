
/**
 * Implement to use onUpdate hook.
 */
export interface StoreOnUpdate {

	/**
	 * Will be triggered on every update just before the new state's value is set,
	 * but after the new value is ready.
	 * - Allows new state modification just before it becomes the new state's value.
	 */
	onUpdate(newState: object, oldState: Readonly<object>): object | void
}
