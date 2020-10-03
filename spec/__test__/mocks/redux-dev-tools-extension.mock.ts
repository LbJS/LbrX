import { ReduxDevToolsExtension, ReduxDevToolsMonitor } from 'lbrx/internal/dev-tools'
import { ReduxDevToolsOptions } from 'lbrx/internal/dev-tools/config'
import { KeyValue } from 'lbrx/internal/types'

export function mockReduxDevToolsExtension(): void {
  const reduxDevToolsMonitor: ReduxDevToolsMonitor = {
    init: (state: {}) => { },
    send: (action: string, state: {}, options?: {}) => { },
    subscribe: (listener: (message: KeyValue) => void) => { },
    unsubscribe: () => { },
    error: (message: string) => { },
  }
  const reduxDevToolsExtension: ReduxDevToolsExtension = {
    connect: (options: ReduxDevToolsOptions) => {
      globalThis.__REDUX_DEVTOOLS_EXTENSION_config__ = options
      return reduxDevToolsMonitor
    },
    disconnect: () => { },
    send: (action: string | {}, state: {}, options?: ReduxDevToolsOptions, instanceId?: string) => { },
    listen: (onMessage: (message: {}) => void, instanceId: string) => { },
    open: (position?: string) => { },
    notifyErrors: (onError?: (error: any) => void) => { },
  }
  globalThis.__REDUX_DEVTOOLS_EXTENSION__ = reduxDevToolsExtension
}

export function deleteReduxDevToolsExtensionMock(): void {
  delete globalThis.__REDUX_DEVTOOLS_EXTENSION__
}
