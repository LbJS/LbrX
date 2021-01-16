import { isArray } from '../helpers'
import { BaseStoreContext } from './base-store-context'
import { ListStore } from './list-store'
import { ListStoreContextParam } from './store-accessories/types/value/list-store-context-param'

export class ListStoreContext<S extends object, Id extends string | number | symbol> extends BaseStoreContext<S[], S> {
  protected readonly _store: ListStore<S, Id>
  protected readonly _idKey: keyof S

  constructor({
    store,
    get$,
    saveActionName,
    onActionOrActions,
    idKey,
  }: ListStoreContextParam<S, Id>) {
    super({ baseStore: store, get$, saveActionName, onActionOrActions })
    this._store = store
    this._idKey = idKey
  }

  /** @override */
  public save(): void {
    const lastValue = this._lastValue
    this._assertSavable(lastValue)
    const ids: Id[] = lastValue.map(x => x[this._idKey as any])
    this._store.update(ids, lastValue, this._saveActionName || undefined)
  }

  public get(id: Id): S
  public get(ids: Id[]): S[]
  public get(idOrIds: Id | Id[]): S | S[] {
    const value = this._store.get<S | S[]>(idOrIds)
    if (!this._isDisposed) this._lastValue = isArray(value) ? value : [value]
    return value
  }

  // public get$(id: Id): Observable<S>
  // public get$(ids: Id[]): Observable<S[]>
  // public get$(idOrIds: Id | Id[]): Observable<S | S[]> {
  //   if (this._valueObservable) return this._valueObservable
  //   const observable = this._get$({
  //     onActionOrActions: this._onActionOrActions,
  //     operators: this._isDisposed ? undefined : [tap((x: S[]) => this._lastValue = x)]
  //   })
  //   if (!this._isDisposed) this._valueObservable = observable
  //   return this._valueObservable || observable
  // }
}
