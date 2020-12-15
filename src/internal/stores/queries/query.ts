import { iif, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, takeWhile, tap } from 'rxjs/operators'
import { assert, isArray, isFunction, isObject, isString } from '../../helpers'
import { Store } from '../store'
import { Actions, ObservableQueryContext, ProjectsOrKeys, QueryableStore } from '../store-accessories'
import { StoreQueryApi } from './store-query-api.interface'

export class Query<T extends object> implements QueryableStore<T> {

  private readonly _storeName: string

  //#region constructor

  constructor(protected readonly store: Store<T>, protected readonly api: StoreQueryApi<T>) {
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
      return !selectContext.isDisposed
    }
    const actionFilterPredicate = () => !action || action === this.api.getLastAction()
    const iffCondition = () => this.store.isLoading && action != Actions.loading
    const mainFilterPredicate = (value: Readonly<T> | null): value is Readonly<T> => {
      return !this.store.isPaused
        && !selectContext.isDisposed
        && !!value
    }
    const mapProject = this._selectMapProject(projectsOrKeys)
    const selectContext: ObservableQueryContext = {
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
            if (selectContext.doSkipOneChangeCheck) return false
            return (isObject(prev) && isObject(curr)) ? this.api.compare(prev, curr) : prev === curr
          }),
          tap(() => selectContext.doSkipOneChangeCheck = false),
          map(x => this.api.cloneIfObject(x)),
        )
    }
    this.api.observableQueryContextsList.push(selectContext)
    return selectContext.observable
  }

  public select$<R, K extends keyof T>(projectsOrKeys?: ProjectsOrKeys<T, R>): Observable<T | R | R[] | T[K] | Pick<T, K>> {
    return this._select$<R, K>(projectsOrKeys)
  }

  public onAction<R>(action: Actions | string): Pick<QueryableStore<T>, 'select$'> {
    return { select$: (projectsOrKeys?: ProjectsOrKeys<T, R>) => this._select$<any, any>(projectsOrKeys, action) }
  }

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
  public disposeObservableQueryContext(observable: Observable<any>): boolean {
    return this.api.observableQueryContextsList.disposeByObservable(observable)
  }

  //#endregion query-methods
}
