
/**
 * Implement to use onAsyncInitError hook.
 */
export interface StoreOnAsyncInitError<E = Error> {

  /**
   * Will be called after async initialization error is received.
   * - Allows error manipulation.
   * - If the function will return the error, it will be rejected and thrown by the store.
   * - If function will return void, no the error will be discontinued.
   */
  onAsyncInitError(error: E): void | E
}
