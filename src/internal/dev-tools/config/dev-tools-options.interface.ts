import { ReduxDevToolsOptions } from './redux-dev-tools-options.interface'

/**
 * Redux DevTolls options.
 */
export interface DevtoolsOptions extends ReduxDevToolsOptions {
  /**
   * Either log or not to Redux DevTools if states are equal.
   * @default
   * logEqualStates = false
   */
  logEqualStates: boolean,
}
