import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { assert } from '../helpers'
import { Store } from './store'
import { Actions, ObservableQueryContext, ObservableQueryContextsList } from './store-accessories'

export class StoreContext<T extends object> {

  protected _lastValue: T | null = null
  protected _selectObservable: Observable<T> | null = null
  protected _isDisposed: boolean = false

  public get isDisposed(): boolean {
    return this._isDisposed
  }


  public get value(): T {
    this._lastValue = this._store.select()
    return this._lastValue
  }

  public get value$(): Observable<T> {
    const observable = this._onAction ? this._store.onAction(this._onAction).select$() : this._store.select$()
    const queryContext = this._queryContextList.find(x => x.observable == observable)
    assert(queryContext, `StoreContext: "${this._store.config.name}" has encountered an critical error while handling the query context observable.`)
    queryContext.observable = queryContext.observable.pipe(tap(x => this._lastValue = x))
    this._selectObservable = queryContext.observable
    if (this._isDisposed) this.dispose()
    return this._selectObservable
  }

  constructor(
    protected readonly _store: Store<T>,
    protected readonly _queryContextList: Array<ObservableQueryContext> & ObservableQueryContextsList,
    protected readonly _saveChangesAction?: string,
    protected readonly _onAction?: Actions | string | (Actions | string)[]
  ) { }

  public saveChanges(): void {
    assert(this._lastValue && this._isDisposed, `StoreContext: "${this._store.config.name}" can't save changes before at least one value has been resolved or after the context is disposed.`)
    this._store.update(this._lastValue, this._saveChangesAction)
  }

  public dispose(): void {
    this._lastValue = null
    if (this._selectObservable) this._store.disposeObservableQueryContext(this._selectObservable)
    this._isDisposed = true
  }
}
