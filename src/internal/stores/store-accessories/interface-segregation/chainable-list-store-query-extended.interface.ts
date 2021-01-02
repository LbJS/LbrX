import { Actions } from '../actions'
import { Compare, Pipe } from '../types'
import { ChainableListStoreQuery } from './chainable-list-store-query.interface'

export interface ChainableListStoreQueryExtended<T, S> extends ChainableListStoreQuery<T> {
  _actions: (Actions | string)[] | null
  _pipMethods: Pipe<any[], any[] | any>[]
  _compare: Compare | null
  _pipe<R>(arr: S[], pipeMethods: Pipe<any[], any[]>[]): R[] | S[]
}
