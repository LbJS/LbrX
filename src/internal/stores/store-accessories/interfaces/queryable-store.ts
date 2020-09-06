import { Observable } from 'rxjs'

export type ProjectsOrKeys<T, R, K> =
  ((value: Readonly<T>) => T | R)
  | ((value: Readonly<T>) => R)[]
  | K
  | K[]
  | string
  | string[]

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
  select$<R>(project: (value: Readonly<T>) => R): Observable<R>
  select$<R extends ReturnType<M>, M extends ((value: Readonly<T>) => any), C = []>(projects: M[]): Observable<R[]>
  select$<R>(projects: ((value: Readonly<T>) => any)[]): Observable<R>
  select$<K extends keyof T>(key: K): Observable<T[K]>
  select$<K extends keyof T>(key: K[]): Observable<Pick<T, K>>

  /**
   * Returns the state's value or the extracted partial value as an Observable based on the provided projection method if it is provided.
   * - This overload provides you with a more dynamic approach compare to other overloads.
   * - With this overload you can create an dynamic Observable factory.
   * @example
   * statesValueProjectionFactory(optionalProjection) {
   *   return weatherStore.select$(optionalProjection);
   * }
   */
  select$<R, K extends keyof T>(dynamic?: ProjectsOrKeys<T, R, K>): Observable<T | R | R[] | T[K] | Pick<T, K>>
  select$<R, K extends keyof T>(projectsOrKeys?: ProjectsOrKeys<T, R, K>): Observable<T | R | R[] | T[K] | Pick<T, K>>
}
