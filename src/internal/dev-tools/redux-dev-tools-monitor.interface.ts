import { KeyValue } from '../types'

export interface ReduxDevToolsMonitor {
  init(state: {}): void
  send(action: string, state: {}): void
  subscribe(listener: (message: KeyValue) => void): void
  unsubscribe(): void
  error(message: string): void
}
