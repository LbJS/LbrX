import { Observable } from 'rxjs'

export interface SelectScope {
  wasHardReset: boolean,
  isDisPosed: boolean,
  observable: Observable<any>
}
