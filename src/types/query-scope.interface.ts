import { Observable } from 'rxjs'

export interface QueryScope {
  wasHardReset: boolean,
  isDisposed: boolean,
  observable: Observable<any>
}
