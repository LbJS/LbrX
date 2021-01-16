import { BaseStoreContext } from './base-store-context'
import { Store } from './store'
import { StoreContextParam } from './store-accessories/types/value/store-context-param'

export class StoreContext<S extends object> extends BaseStoreContext<S, S> {
  protected readonly _store: Store<S>

  constructor({
    store,
    get$,
    saveActionName: saveAction,
    onActionOrActions,
  }: StoreContextParam<S>) {
    super({ baseStore: store, get$, saveActionName: saveAction, onActionOrActions })
    this._store = store
  }

  /** @override */
  public save(): void {
    this._assertSavable(this._lastValue)
    this._store.update(this._lastValue, this._saveActionName || undefined)
  }
}
