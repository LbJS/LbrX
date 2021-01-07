import { Actions } from 'lbrx'

export interface AllStoreHooks<T extends object, E = any> {
  onBeforeInit(nextState: T): void | T
  onAfterInit(currState: T): void | T
  onAsyncInitError(error: E): void | E
  onAsyncInitSuccess(result: T): void | T
  osStateChange(action: Actions | string, nextState: T | null, currState: Readonly<T> | null): void | T
  onReset(nextState: T, currState: Readonly<T>): void | T
}
