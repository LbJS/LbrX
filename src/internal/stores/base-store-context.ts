import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { assert } from '../helpers'
import { Unpack } from '../types'
import { BaseStore } from './base-store'
import { Actions, ObservableQueryContext, ObservableQueryContextsList, ValueObservableMethodParam } from './store-accessories'
import { BaseStoreContextParam } from './store-accessories/types/value/base-store-context-param'

export abstract class BaseStoreContext<S extends object, M extends object> {
  protected readonly _baseStore: BaseStore<S, Unpack<S> | object>
  protected readonly _get$: (value: ValueObservableMethodParam<S, S>) => Observable<S>
  protected readonly _queryContextList: Array<ObservableQueryContext<any>> & ObservableQueryContextsList
  protected readonly _saveAction: string | null
  protected readonly _onActionOrActions: Actions | string | (Actions | string)[] | null

  protected _lastValue: S | null = null
  protected _getObservable: Observable<S> | null = null
  protected _isDisposed: boolean = false

  public get isDisposed(): boolean {
    return this._isDisposed
  }

  public get value(): S {
    const value = this._baseStore.value
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

  constructor({
    baseStore,
    get$,
    queryContextList,
    saveActionName: saveAction,
    onActionOrActions,
  }: BaseStoreContextParam<S, M>) {
    this._baseStore = baseStore
    this._get$ = get$
    this._queryContextList = queryContextList
    this._saveAction = saveAction || null
    this._onActionOrActions = onActionOrActions || null
  }

  /**
   * @deprecated
   * User the `save()` method instead.
   */
  public saveChanges(): void {
    this.save()
  }

  protected _assertSavable(value: S | null): asserts value is S {
    assert(value && !this._isDisposed, `StoreContext: "${this._baseStore.config.name}" can't save changes before at least one value has been resolved or after the context is disposed.`)
  }

  public dispose(): void {
    this._lastValue = null
    if (this._getObservable) {
      this._baseStore.disposeObservable(this._getObservable)
      this._getObservable = null
    }
    this._isDisposed = true
  }

  public abstract save(): void
}
