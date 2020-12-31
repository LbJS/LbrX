import { Actions } from '../actions'
import { Pipe } from '../types'
import { QueryableListStore } from './queryable-list-store.interface'

export interface QueryableListStoreExtended<T, S> extends QueryableListStore<T> {
  _actions: (Actions | string)[] | null
  _pipMethods: Pipe<any[], any[] | any>[]
  _pipe<R>(arr: S[], pipeMethods: Pipe<any[], any[]>[]): R[] | S[]
}
