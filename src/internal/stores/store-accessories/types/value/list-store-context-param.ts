import { ListStore } from '../../../list-store'
import { BaseStoreContextParam } from './base-store-context-param'

export type ListStoreContextParam<T extends object, Id extends string | number | symbol> =
  Omit<BaseStoreContextParam<T[], T>, `baseStore`> & {
    store: ListStore<T, Id>,
    idKey: keyof T
  }
