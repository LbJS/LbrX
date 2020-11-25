
/**
 * Redux DevTolls options.
 */
export interface DevtoolsOptions {
  /**
   * The main store name that will be displayed at Redux DevTools.
   * @default
   * name = 'LBRX-STORE'
   */
  name: string,
  /**
   * Either log or not to Redux DevTools if states are equal.
   * @default
   * logEqualStates = false
   */
  logEqualStates: boolean,
}
