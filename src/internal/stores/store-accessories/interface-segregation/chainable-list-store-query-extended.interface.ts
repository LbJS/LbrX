import { Actions } from '../actions'
import { Compare, Pipe } from '../types'
import { ChainableListStoreQuery } from './chainable-list-store-query.interface'

export interface ChainableListStoreQueryExtended<T, S> extends ChainableListStoreQuery<T> {
  _actions: (Actions | string)[] | null
  _pipMethods: Pipe<readonly any[], readonly any[] | Readonly<any>>[]
  _compare: Compare | null
  _pipe<R>(arr: readonly S[], pipeMethods: Pipe<readonly any[], readonly any[] | Readonly<any>>[]
  ): readonly R[] | readonly S[] | Readonly<R> | Readonly<S>
}
