import { SortMethod } from '../../../types'
import { ListStore } from '../../list-store'
import { Actions } from '../actions'

// tslint:disable: quotemark
export interface QueryableListStore<T extends object, E = any> extends Pick<ListStore<T, E>,
  'select' | 'where' | 'when' | 'orderBy' | 'toList'> {
  project?: (value: Readonly<T>) => any
  filterPredicate?: (value: T, index: number, array: T[]) => T
  onActions?: (Actions | string)[]
  sortingMethod?: SortMethod<any>
  toList<R>(predicate?: (value: T, index: number, array: T[]) => T): T[] | R[]
  firstOrDefault<R>(predicate?: (value: T, index: number, array: T[]) => T): T | R | null
  first<R>(predicate?: (value: T, index: number, array: T[]) => T): T | R | never
}
