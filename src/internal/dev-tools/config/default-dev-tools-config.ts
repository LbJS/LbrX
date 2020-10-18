import { DevtoolsOptions } from './dev-tools-options.interface'

export function getDefaultDevToolsConfig(): DevtoolsOptions {
  return {
    name: `LBRX-STORE`,
    maxAge: 50,
    logEqualStates: false,
    displayValueAsState: false,
    showStackTrace: false,
  }
}
