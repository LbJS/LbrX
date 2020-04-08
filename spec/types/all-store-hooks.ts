import { StoreAfterInit, StoreBeforeInit, StoreOnAsyncInitError, StoreOnAsyncInitSuccess, StoreOnOverride, StoreOnReset, StoreOnUpdate } from 'lbrx/hooks'

export type AllStoreHooks<T extends object, E = any> =
  StoreBeforeInit<T> &
  StoreAfterInit<T> &
  StoreOnAsyncInitSuccess<T> &
  StoreOnAsyncInitError<E> &
  StoreOnOverride<T> &
  StoreOnReset<T> &
  StoreOnUpdate<T>

