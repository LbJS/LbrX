
/**
 * Supported storages.
 */
export const enum Storages {
  /**
   * Disables any state's value cache storage.
   */
  none,
  /**
   * Local storage. (window.localStorage)
   */
  local,
  /**
   * Session storage. (window.sessionStorage)
   */
  session,
  /**
   * Any storage that implements Storage-api.
   */
  custom,
}
