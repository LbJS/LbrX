import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { cloneError, cloneObject, isError, isNull, isObject } from '../helpers'

/**
 * Global Error-API. Will hold and emit the last error from all stores.
 */
export class LbrxErrorStore<T = any> {

  private static _globalErrorStore: LbrxErrorStore | null = null

  private readonly _error$ = new BehaviorSubject<T | null>(null)

  public get error$(): Observable<T | null> {
    return this._error$.asObservable()
      .pipe(
        map(x => {
          if (isError(x)) return cloneError(x)
          if (isObject(x)) return cloneObject(x)
          return x
        }),
        distinctUntilChanged((prev, curr) => isNull(prev) && isNull(curr)),
      )
  }

  protected constructor() { }

  public static getStore<E>(): LbrxErrorStore<E> {
    if (isNull(LbrxErrorStore._globalErrorStore)) {
      LbrxErrorStore._globalErrorStore = new LbrxErrorStore<E>()
    }
    return LbrxErrorStore._globalErrorStore
  }

  public getError(): T | null {
    const value = this._error$.getValue()
    if (isError(value)) return cloneError(value)
    if (isObject(value)) return cloneObject(value)
    return value
  }

  public setError(value: T | null): void {
    if (isError(value)) {
      value = cloneError(value)
    } else if (isObject(value)) {
      value = cloneObject(value)
    }
    this._error$.next(value)
  }

  public isError(): boolean {
    return !!this._error$.getValue()
  }
}
