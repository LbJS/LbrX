import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { assert } from '../helpers'
import { BaseStore } from './base-store'
import { Store } from './store'
import { Actions, GetObservableParam, ObservableQueryContext, ObservableQueryContextsList } from './store-accessories'

export class StoreContext<S extends object> {

  protected _lastValue: S | null = null
  protected _getObservable: Observable<S> | null = null
  protected _isDisposed: boolean = false

  public get isDisposed(): boolean {
    return this._isDisposed
  }

  public get value(): S {
    const value = this._store.value
    if (!this._isDisposed) this._lastValue = value
    return value
  }

  public get value$(): Observable<S> {
    if (this._getObservable) return this._getObservable
    const observable = this._get$({
      onActionOrActions: this._onActionOrActions,
      operators: [tap((x: S) => this._lastValue = x)]
    })
    if (!this._isDisposed) this._getObservable = observable
    return this._getObservable || observable
  }

  constructor(
    protected readonly _store: BaseStore<S, S>,
    protected readonly _get$: (value: GetObservableParam<S, S>) => Observable<S>,
    protected readonly _queryContextList: Array<ObservableQueryContext<any>> & ObservableQueryContextsList,
    protected readonly _saveAction?: string,
    protected readonly _onActionOrActions?: Actions | string | (Actions | string)[]
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
    if (this._store instanceof Store) {
      this._store.update(this._lastValue, this._saveAction)
    }
  }

  public dispose(): void {
    this._lastValue = null
    if (this._getObservable) {
      this._store.disposeObservable(this._getObservable)
      this._getObservable = null
    }
    this._isDisposed = true
  }
}
