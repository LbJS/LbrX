import { DevtoolsOptions } from '../../dev-tools'

export function getDefaultDevToolsConfig(): DevtoolsOptions {
  return {
    name: 'LBRX-STORE',
    logEqualStates: false,
  }
}
