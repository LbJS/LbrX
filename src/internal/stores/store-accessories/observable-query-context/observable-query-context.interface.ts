import { Observable } from 'rxjs'

export interface ObservableQueryContext {
  doSkipOneChangeCheck: boolean,
  isDisposed: boolean,
  observable: Observable<any>
}
