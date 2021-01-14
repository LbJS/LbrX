import { Store } from '../../../store'
import { BaseStoreContextParam } from './base-store-context-param'

export type StoreContextParam<T extends object> = Omit<BaseStoreContextParam<T, T>, `baseStore`> & {
  store: Store<T>,
}
