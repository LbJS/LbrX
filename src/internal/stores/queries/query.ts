import { iif, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, takeWhile, tap } from 'rxjs/operators'
import { assert, isArray, isFunction, isObject, isString } from '../../helpers'
import { Store } from '../store'
import { Actions, ProjectsOrKeys, QueryableStore, QueryContext } from '../store-accessories'
import { QueryStoreApi } from './store-query-api.interface'

export class Query<T extends object> implements QueryableStore<T> {

  private readonly _storeName: string

  //#region constructor

  constructor(protected readonly store: Store<T>, protected readonly api: QueryStoreApi<T>) {
    this._storeName = store.config.name
  }

  //#endregion constructor
  //#region query-methods

  protected _selectMapProject<R, K extends keyof T>(projectsOrKeys?: ProjectsOrKeys<T, R>): (value: Readonly<T>) => T | R | any[] | T[K] | Pick<T, K> {
    if (isArray(projectsOrKeys) && projectsOrKeys.length) {
      if ((<((value: Readonly<T>) => R)[]>projectsOrKeys).every(x => isFunction(x))) {
        return (value: Readonly<T>) => (<((value: Readonly<T>) => R)[]>projectsOrKeys).map(x => x(value))
      }
      if ((<string[]>projectsOrKeys).every(x => isString(x))) {
        return (value: Readonly<T>) => {
          const result = {} as R;
          (<string[]>projectsOrKeys).forEach((x: string) => result[x] = value[x])
          return result
        }
      }
    }
    if (isString(projectsOrKeys)) return (value: Readonly<T>) => value[projectsOrKeys as string]
    if (isFunction(projectsOrKeys)) return projectsOrKeys
    return (x: Readonly<T>) => x
  }

  protected _select$<R, K extends keyof T>(
    projectsOrKeys?: ProjectsOrKeys<T, R>,
    action?: Actions | string
  ): Observable<T | R | R[] | T[K] | Pick<T, K>> {
    const takeWhilePredicate = () => {
      return !queryContext.isDisposed
    }
    const actionFilterPredicate = () => !action || action === this.api.getLastAction()
    const iffCondition = () => this.store.isLoading && action != Actions.loading
    const mainFilterPredicate = (value: Readonly<T> | null): value is Readonly<T> => {
      return !this.store.isPaused
        && !queryContext.isDisposed
        && !!value
    }
    const mapProject = this._selectMapProject(projectsOrKeys)
    const queryContext: QueryContext = {
      doSkipOneChangeCheck: false,
      isDisposed: false,
      observable: this.api.value$.asObservable()
        .pipe(
          takeWhile(takeWhilePredicate),
          filter(actionFilterPredicate),
          mergeMap(x => iif(iffCondition, this.api.whenLoaded$, of(x))),
          filter(mainFilterPredicate),
          map(mapProject),
          distinctUntilChanged((prev, curr) => {
            if (queryContext.doSkipOneChangeCheck) return false
            return (isObject(prev) && isObject(curr)) ? this.api.compare(prev, curr) : prev === curr
          }),
          tap(() => queryContext.doSkipOneChangeCheck = false),
          map(x => this.api.cloneIfObject(x)),
        )
    }
    this.api.queryContextsList.push(queryContext)
    return queryContext.observable
  }

  /**
   * Returns the state's value as an Observable.
   * @example
   * weatherStore.select$().subscribe(value => {
   *   // do something with the weather...
   * });
   */
  public select$(): Observable<T>
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
  public select$<R>(project: (value: Readonly<T>) => R): Observable<R>
  /**
   * Returns an array values as an Observable based on the provided projection methods.
   * @example
   * weatherStore.select$([value => value.isRaining, value => value.precipitation])
   *   .subscribe(result => {
   *     const [isRaining, precipitation] = result
   *     // do something...
   *  });
   */
  public select$<R extends ReturnType<M>, M extends ((value: Readonly<T>) => any)>(projects: M[]): Observable<R[]>
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
  public select$<R extends any[]>(projects: ((value: Readonly<T>) => any)[]): Observable<R>
  /**
   * Returns as single the state's value property based on the provided key.
   * @example
   * weatherStore.select$('precipitation')
   *   .subscribe(precipitation => {
   *     // do something...
   *  });
   */
  public select$<K extends keyof T>(key: K): Observable<T[K]>
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
  public select$<K extends keyof T>(keys: K[]): Observable<Pick<T, K>>
  /**
   * This is an dynamic overload. Use this approach only if necessary because it's not strongly typed.
   * @example
   * function selectFactory(dynamic?) {
   *   return weatherStore.select$(dynamic?);
   * }
   */
  public select$<R>(dynamic?: ProjectsOrKeys<T, R>): Observable<R>
  public select$<R, K extends keyof T>(projectsOrKeys?: ProjectsOrKeys<T, R>): Observable<T | R | R[] | T[K] | Pick<T, K>> {
    return this._select$<R, K>(projectsOrKeys)
  }

  public onAction<R>(action: Actions | string): Pick<QueryableStore<T>, 'select$'> {
    return { select$: (projectsOrKeys?: ProjectsOrKeys<T, R>) => this._select$<any, any>(projectsOrKeys, action) }
  }

  /**
   * Returns the state's value.
   * @example
   * const value = weatherStore.select()
   */
  public select(): T
  /**
   * Returns the extracted partial state's value based on the provided projection method.
   * @example
   * const isRaining = weatherStore.select(value => value.isRaining)
   */
  public select<R>(project: (value: Readonly<T>) => R): R
  /**
   * Returns an array values based on the provided projection methods.
   * @example
   * const [isRaining, precipitation] = weatherStore.select([value => value.isRaining, value => value.precipitation])
   */
  public select<R extends ReturnType<M>, M extends ((value: Readonly<T>) => any)>(projects: M[]): R[]
  /**
   * Returns an array values based on the provided projections methods.
   * - This overload allows to manually define the return type.
   * @example
   * const [isRaining, precipitation] = weatherStore.select([value => value.isRaining, value => value.precipitation])
   */
  public select<R extends any[]>(projects: ((value: Readonly<T>) => any)[]): R
  /**
   * Returns as single the state's value property based on the provided key.
   * @example
   * const precipitation = weatherStore.select('precipitation')
   */
  public select<K extends keyof T>(key: K): T[K]
  /**
   * Returns the extracted partial state's value based on the provided keys.
   * @example
   * const { precipitation, isRaining } = weatherStore.select(['precipitation', 'isRaining'])
   */
  public select<K extends keyof T>(keys: K[]): Pick<T, K>
  /**
   * This is an dynamic overload. Use this approach only if necessary because it's not strongly typed.
   * @example
   * function selectFactory(dynamic?) {
   *   return weatherStore.select(dynamic?);
   * }
   */
  public select<R>(dynamic?: ProjectsOrKeys<T, R>): R
  public select<R, K extends keyof T>(projectsOrKeys?: ProjectsOrKeys<T, R>): T | R | R[] | T[K] | Pick<T, K> {
    const mapProject = this._selectMapProject(projectsOrKeys)
    const value = this.api.getValue()
    assert(value, `Store: "${this._storeName}" has tried to access state's value before initialization.`)
    const mappedValue = mapProject(value)
    return this.api.cloneIfObject(mappedValue)
  }

  /**
   * Disposes the observable by completing the observable and removing it from query context list.
   */
  public disposeQueryContext(observable: Observable<any>): boolean {
    return this.api.queryContextsList.disposeByObservable(observable)
  }

  //#endregion query-methods
}
