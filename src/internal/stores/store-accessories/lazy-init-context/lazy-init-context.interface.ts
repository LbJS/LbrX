import { Observable } from 'rxjs'

export interface LazyInitContext<T extends object> {
  value: Promise<T> | Observable<T>
  isCanceled: boolean
  resolve: (value?: void | PromiseLike<void> | undefined) => void
  reject: (reason?: any) => void
}
