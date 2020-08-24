import { DevtoolsOptions } from './dev-tools-options.interface'

export function getDefaultDevToolsConfig(): DevtoolsOptions {
  return {
    name: 'LBRX-STORE',
    maxAge: 5,
    logEqualStates: false,
    displayValueAsState: false,
  }
}
