import { Observable } from 'rxjs'

export interface QueryContext {
  wasHardReset: boolean,
  isDisposed: boolean,
  observable: Observable<any>
}
