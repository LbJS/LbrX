import { BehaviorSubject, Observable } from 'rxjs'
import { isNull } from 'lbrx/helpers'

/**
 * Global Error-API. Will hold and emit the last error from all stores.
 */
export class GlobalErrorStore<T = any> {

	private static _globalErrorStore: GlobalErrorStore | null = null

	private readonly _globalError$ = new BehaviorSubject<T | null>(null)

	public readonly globalError$: Observable<T | null> = this._globalError$.asObservable()

	protected constructor() { }

	public static getStore<E>(): GlobalErrorStore<E> {
		if (isNull(GlobalErrorStore._globalErrorStore)) {
			GlobalErrorStore._globalErrorStore = new GlobalErrorStore<E>()
		}
		return GlobalErrorStore._globalErrorStore
	}

	public getGlobalError(): T | null {
		return this._globalError$.getValue()
	}

	public setGlobalError(value: T | null): void {
		return this._globalError$.next(value)
	}

	public isGlobalError(): boolean {
		return !!this._globalError$.getValue()
	}
}
