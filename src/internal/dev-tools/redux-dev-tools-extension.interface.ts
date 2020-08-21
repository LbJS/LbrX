import { ReduxDevToolsOptions } from './config'
import { ReduxDevToolsMonitor } from './redux-dev-tools-monitor.interface'

export interface ReduxDevToolsExtension {
  connect(options: ReduxDevToolsOptions): ReduxDevToolsMonitor
  disconnect(): void
  send(action: string | {}, state: {}, options?: ReduxDevToolsOptions, instanceId?: string): void
  listen(onMessage: (message: {}) => void, instanceId: string): void
  open(position?: string): void
  notifyErrors(onError?: (error: any) => void): void
}
