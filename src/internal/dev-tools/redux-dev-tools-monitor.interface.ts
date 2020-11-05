import { ReduxDevToolsMessage } from './redux-dev-tools-message.interface'

export interface ReduxDevToolsMonitor {
  init(state: {}): void
  send(action: string, state: {}, options?: {}): void
  subscribe(listener: (message: ReduxDevToolsMessage) => void): void
  unsubscribe(): void
  error(message: string): void
}
