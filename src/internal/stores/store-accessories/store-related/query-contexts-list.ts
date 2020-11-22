import { Observable } from 'rxjs'
import { BaseStore } from '../../base-store'
import { QueryContext } from './query-context.interface'

export class QueryContextsList extends Array<QueryContext> {

  public set wasHardReset(value: boolean) {
    this.forEach(x => x.wasHardReset = value)
  }

  constructor(private readonly _store: BaseStore<any, any>) {
    super()
  }

  public push(...items: QueryContext[]): number {
    if (this._store[`_lazyInitContext`]) this._store[`_initializeLazily`]()
    return super.push(...items)
  }

  public disposeByIndex(index: number): boolean {
    if (this[index]) {
      this[index].isDisposed = true
      this.splice(index, 1)
      return true
    }
    return false
  }

  public disposeByObservable(observable: Observable<any>): boolean {
    const index = this.findIndex(x => x.observable == observable)
    return index > -1 ? this.disposeByIndex(index) : false
  }

  public disposeAll(): number {
    const itemsCount = this.length
    this.forEach(x => x.isDisposed = true)
    this.splice(0, this.length)
    return itemsCount
  }
}
