import { Observable, Subject } from 'rxjs'
import { Actions, Compare, ObservableQueryContext, ObservableQueryContextsList } from '../store-accessories'

export interface StoreQueryApi<T extends object> {
  getValue: () => Readonly<T> | null
  getLastAction: () => Actions | string | null
  value$: Subject<Readonly<T> | null>
  whenLoaded$: Observable<Readonly<T> | null>
  observableQueryContextsList: Array<ObservableQueryContext> & ObservableQueryContextsList
  compare: Compare
  cloneIfObject: (value: any) => any
}
