import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { assert } from '../helpers'
import { Store } from './store'
import { Actions, ObservableQueryContext, ObservableQueryContextsList } from './store-accessories'

export class StoreContext<T extends object> {

  protected _lastValue: T | null = null
  protected _getObservable: Observable<T> | null = null
  protected _isDisposed: boolean = false

  public get isDisposed(): boolean {
    return this._isDisposed
  }

  public get value(): T {
    const value = this._store.get()
    if (!this._isDisposed) this._lastValue = value
    return value
  }

  public get value$(): Observable<T> {
    const observable = this._onAction ? this._store.onAction(this._onAction).get$() : this._store.get$()
    if (!this._isDisposed) {
      const queryContext = this._queryContextList.find(x => x.observable == observable)
      assert(queryContext, `StoreContext: on "${this._store.config.name}" has encountered an critical error while handling the query context observable.`)
      queryContext.observable = queryContext.observable.pipe(tap(x => this._lastValue = x))
      this._getObservable = queryContext.observable
    }
    return this._getObservable || observable
  }

  constructor(
    protected readonly _store: Store<T>,
    protected readonly _queryContextList: Array<ObservableQueryContext> & ObservableQueryContextsList,
    protected readonly _saveAction?: string,
    protected readonly _onAction?: Actions | string | (Actions | string)[]
  ) { }

  /**
   * @deprecated
   * User the `save()` method instead.
   */
  public saveChanges(): void {
    this.save()
  }

  public save(): void {
    assert(this._lastValue && !this._isDisposed, `StoreContext: "${this._store.config.name}" can't save changes before at least one value has been resolved or after the context is disposed.`)
    this._store.update(this._lastValue, this._saveAction)
  }

  public dispose(): void {
    this._lastValue = null
    if (this._getObservable) {
      this._store.disposeObservableQueryContext(this._getObservable)
      this._getObservable = null
    }
    this._isDisposed = true
  }
}
