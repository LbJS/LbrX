
/**
 * Implement to use onAsyncInitSuccess hook.
 */
export interface StoreOnAsyncInitSuccess<T = object> {

	/**
	 * Will be called after async initialization data was received
	 * and before any set state functionality.
	 * - Allows mapping or any data manipulations to the received data.
	 */
	onAsyncInitSuccess(result: T): void | T
}
