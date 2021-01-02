import { Observable } from 'rxjs'

export interface ObservableQueryContext<T> {
  doSkipOneChangeCheck: boolean,
  isDisposed: boolean,
  observable: Observable<T>
}
