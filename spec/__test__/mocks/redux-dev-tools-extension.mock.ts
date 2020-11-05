import { ReduxDevToolsExtension, ReduxDevToolsMessage } from 'lbrx/internal/dev-tools'
import { ReduxDevToolsOptions } from 'lbrx/internal/dev-tools/config'

export function mockReduxDevToolsExtension(): void {
  const getReduxDevToolsMonitor = () => {
    let subscribers: ((message: ReduxDevToolsMessage) => void)[] = []
    return {
      init: (state: {}) => { },
      send: (action: string, state: {}, options?: {}) => { },
      subscribe: (listener: (message: ReduxDevToolsMessage) => void) => {
        subscribers.push(listener)
      },
      unsubscribe: () => {
        subscribers = []
      },
      error: (message: string) => { },
      emitMsg: (message: ReduxDevToolsMessage) => {
        subscribers.forEach(x => x(message))
      }
    }
  }
  const reduxDevToolsExtension: ReduxDevToolsExtension = {
    connect: (options: ReduxDevToolsOptions) => {
      globalThis.__REDUX_DEVTOOLS_EXTENSION_config__ = options
      return getReduxDevToolsMonitor()
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
