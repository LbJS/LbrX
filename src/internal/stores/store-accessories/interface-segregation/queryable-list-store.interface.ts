import { SortMethod } from '../../../types'
import { ListStore } from '../../list-store'
import { Actions } from '../actions'

// tslint:disable: quotemark
export interface QueryableListStore<T extends any, S extends object, E = any> extends Pick<ListStore<S, E>,
  'select' | 'where' | 'when' | 'orderBy' | 'toList' | 'firstOrDefault' | 'first'> {
  project?: (value: Readonly<T>) => any
  filterPredicate?: (value: T, index: number, array: T[]) => T
  onActions?: (Actions | string)[]
  sortingMethod?: SortMethod<any>
}
