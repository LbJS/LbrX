import { Observable } from 'rxjs'

export interface QueryScope {
  wasHardReset: boolean,
  isDisPosed: boolean,
  observable: Observable<any>
}
