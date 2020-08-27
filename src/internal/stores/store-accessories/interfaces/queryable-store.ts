import { Observable } from 'rxjs'

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
  /**
   * Returns the state's value or the extracted partial value as an Observable based on the provided projection method if it is provided.
   * - This overload provides you with a more dynamic approach compare to other overloads.
   * - With this overload you can create an dynamic Observable factory.
   * @example
   * statesValueProjectionFactory(optionalProjection) {
   *   return weatherStore.select$(optionalProjection);
   * }
   */
  select$<R>(project?: (value: Readonly<T>) => T | R): Observable<T | R>
  select$<R>(project?: (value: Readonly<T>) => T | R): Observable<T | R>
}
