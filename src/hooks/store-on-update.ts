
/**
 * Implement to use onUpdate hook.
 */
export interface StoreOnUpdate<T = object> {

	/**
	 * Will be triggered on every update just before the new state's value is set,
	 * but after the new value is ready.
	 * - Allows new state modification just before it becomes the new state's value.
	 */
	onUpdate(nextState: T, currState: Readonly<T>): void | T
}
