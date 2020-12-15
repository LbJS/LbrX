import { Observable } from 'rxjs'

export interface QueryContext {
  doSkipOneChangeCheck: boolean,
  isDisposed: boolean,
  observable: Observable<any>
}
