import { Observable } from 'rxjs'

export type ProjectsOrKeys<T, R> =
  ((value: Readonly<T>) => T | R)
  | ((value: Readonly<T>) => R)[]
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
  /**
   * Returns an array values as an Observable based on the provided projections methods.
   * @example
   * weatherStore.select$([value => value.isRaining, value => value.precipitation])
   *   .subscribe(result => {
   *     const [isRaining, precipitation] = result
   *     // do something...
   *  });
   */
  select$<R extends ReturnType<M>, M extends ((value: Readonly<T>) => any)>(projects: M[]): Observable<R[]>
  /**
   * Returns an array values as an Observable based on the provided projections methods.
   * - This overload allows to manually define the return type.
   * @example
   * weatherStore.select$([value => value.isRaining, value => value.precipitation])
   *   .subscribe(result => {
   *     const [isRaining, precipitation] = result
   *     // do something...
   *  });
   */
  select$<R>(projects: ((value: Readonly<T>) => any)[]): Observable<R[]>
  /**
   * Returns as single the state's value property based on the provided key.
   * @example
   * weatherStore.select$('precipitation')
   *   .subscribe(precipitation => {
   *     // do something...
   *  });
   */
  select$<K extends keyof T>(key: K): Observable<T[K]>
  /**
   * Returns the extracted partial state's value as an Observable based on the provided keys.
   * @example
   * weatherStore.select$(['precipitation', 'isRaining'])
   *   .subscribe(result => {
   *      if (result.isRaining && result.precipitation.mm > 10) {
   *        // do something...
   *      }
   *  });
   */
  select$<K extends keyof T>(keys: K[]): Observable<Pick<T, K>>
  /**
   * This is an dynamic overload. Use this approach only id necessary because it's not strongly typed.
   * @example
   * function selectFactory(dynamic?) {
   *   return weatherStore.select$(dynamic?);
   * }
   */
  select$<R>(dynamic?: ProjectsOrKeys<T, R>): Observable<any>
}
