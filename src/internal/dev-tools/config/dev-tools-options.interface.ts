import { ReduxDevToolsOptions } from './redux-dev-tools-options.interface'

/**
 * Redux DevTolls options.
 */
export interface DevtoolsOptions extends ReduxDevToolsOptions {
  /**
   * Either or not the Redux DevTools Monitor should log equal states.
   * - If the states are equal but the actions are different, the state will be logged even though it wasn't change.
   * @default
   * logEqualStates = false
   */
  logEqualStates: boolean
  /**
   * Shows state's value instead of the whole state in Redux DevTools Monitor.
   * @default
   * displayValueAsState = false
   */
  displayValueAsState: boolean
  /**
   * Show stack trace in Redux DevTools Monitor along with the state.
   * @default
   * showStackTrace = false
   */
  showStackTrace: boolean
}
