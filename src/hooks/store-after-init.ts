
/**
 * Implement to use onAfterInit hook.
 */
export interface StoreAfterInit {

	/**
	 * Will be triggered only once, after the store would complete the initialization.
	 * - Allows state's value modification after initialization.
	 */
	onAfterInit(state: object): object | void
}
