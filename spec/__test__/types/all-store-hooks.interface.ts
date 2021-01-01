
export interface AllStoreHooks<T extends object, E = any> {
  onBeforeInit(nextState: T): void | T
  onAfterInit(currState: T): void | T
  onAsyncInitError(error: E): void | E
  onAsyncInitSuccess(result: T): void | T
  onUpdate(nextState: T, currState: Readonly<T>): void | T
  /** @deprecated */
  onOverride(nextState: T, prevState: Readonly<T>): void | T
  onSet(nextState: T, prevState: Readonly<T>): void | T
  onReset(nextState: T, currState: Readonly<T>): void | T
}
