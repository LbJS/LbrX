import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Global Error-API. Will emit errors from all stores.
 */
export class GlobalErrorStore {

	private static readonly _globalError$ = new BehaviorSubject<any>(null)
	public static readonly globalError$ = (): Observable<any> => {
		return GlobalErrorStore._globalError$.asObservable()
	}
	public static readonly getGlobalError = (): any => {
		return GlobalErrorStore._globalError$.getValue()
	}
	public static readonly setGlobalError = (value: any): void => {
		return GlobalErrorStore._globalError$.next(value)
	}
	public static readonly isGlobalError = (): boolean => {
		return !!GlobalErrorStore._globalError$.getValue()
	}

	private constructor() { }
}
