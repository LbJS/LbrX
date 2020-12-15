import { Observable, Subject } from 'rxjs'
import { Actions, Compare, QueryContext, QueryContextsList } from '../store-accessories'

export interface QueryStoreApi<T extends object> {
  getValue: () => Readonly<T> | null
  getLastAction: () => Actions | string | null
  value$: Subject<Readonly<T> | null>
  whenLoaded$: Observable<Readonly<T> | null>
  queryContextsList: Array<QueryContext> & QueryContextsList
  compare: Compare
  cloneIfObject: (value: any) => any
}
