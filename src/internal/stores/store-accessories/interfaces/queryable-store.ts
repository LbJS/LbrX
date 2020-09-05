import { Observable } from 'rxjs'

export type ProjectsOrKeys<T, R> =
  ((value: Readonly<T>) => T | R)
  | ((value: Readonly<T>) => R)[]
// | K
// | K[]
// | string
// | string[]

export interface QueryableStore<T extends object> {
  /**
   * Returns the state's value as an Observable.
   * @example
   * weatherStore.select$().subscribe(value => {
   *   // do something with the weather...
   * });
   */
  select$(): Observable<T>
  /**
   * Returns the extracted partial state's value as an Observable based on the provided projection method.
   * @example
   * weatherStore.select$(value => value.isRaining)
   *   .subscribe(isRaining => {
   *     if (isRaining) {
   *        // do something when it's raining...
   *     }
   *  });
   */
  select$<R>(project: (value: Readonly<T>) => T | R): Observable<R>
  select$<R extends ReturnType<M>, M extends ((value: Readonly<T>) => any), C = []>(projects: M[]): Observable<R[]>
  select$<R>(projects: ((value: Readonly<T>) => any)[]): Observable<R>
  // select$<K extends keyof T>(key: K): Observable<T[K]>
  // select$<R = unknown>(key: string): Observable<R>
  // select$<K extends keyof T>(key: K[]): Observable<Pick<T, K>>
  // select$<K extends keyof T>(key: K[], returnAsArray?: boolean)
  //   : typeof returnAsArray extends true ? Observable<(T[K])[]> : Observable<Pick<T, K>>
  // select$<R extends object = object>(key: string[]): Observable<R>
  // select$<R extends object = object>(key: string[], returnAsArray?: boolean)
  //   : typeof returnAsArray extends true ? Observable<unknown[]> : Observable<R>

  /**
   * Returns the state's value or the extracted partial value as an Observable based on the provided projection method if it is provided.
   * - This overload provides you with a more dynamic approach compare to other overloads.
   * - With this overload you can create an dynamic Observable factory.
   * @example
   * statesValueProjectionFactory(optionalProjection) {
   *   return weatherStore.select$(optionalProjection);
   * }
   */
  select$<R>(dynamic?: ProjectsOrKeys<T, R>): Observable<T | R | R[]>
  select$<R>(projectsOrKeys?: ProjectsOrKeys<T, R>): Observable<T | R | R[]>
}
