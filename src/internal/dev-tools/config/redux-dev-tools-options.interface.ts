
export interface ReduxDevToolsOptions {
  /**
   * The instance name to be shown on the Redux DevTools Monitor.
   * @default
   * name = 'LBRX-STORE'
   */
  name: string
  /**
   * Maximum allowed actions to be stored in the history tree in Redux DevTools Monitor.
   * @default
   * maxAge = 50
   */
  maxAge: number
}
