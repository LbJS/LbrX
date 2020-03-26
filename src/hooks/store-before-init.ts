
/**
 * Implement to use onBeforeInit hook.
 */
export interface StoreBeforeInit {

	/**
	 * Will be triggered only once, before the store would set it's initial state's value.
	 * - Allows state's value modification before initialization.
	 */
	onBeforeInit(initialState: object): object | void
}
