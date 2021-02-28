import { ListStore } from '../../../list-store'
import { Project } from '../method'
import { BaseStoreContextParam } from './base-store-context-param'

export type ListStoreContextParam<T extends object, Id extends string | number | symbol> =
  Omit<BaseStoreContextParam<T[], T>, `baseStore`> & {
    store: ListStore<T, Id>,
    idKey: keyof T,
    projectBasedByIds<R>(idOrIds: Id | Id[], project: Project<T, R>): Project<T | T[], any>
  }
