import { Observable } from 'rxjs'

export interface LazyInitScope<T extends object> {
  value: Promise<T> | Observable<T>
  resolve: (value?: void | PromiseLike<void> | undefined) => void
  reject: (reason?: any) => void
}
