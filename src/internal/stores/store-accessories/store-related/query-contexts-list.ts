import { BaseStore } from '../../base-store'
import { QueryContext } from './query-context.interface'

export class QueryContextsList extends Array<QueryContext> {

  constructor(private readonly _store: BaseStore<any, any>) {
    super()
  }

  public push(...items: QueryContext[]): number {
    this._store[`_initializeLazily`]()
    return super.push(...items)
  }

  public disposeByIndex(index: number): void {
    if (this[index]) {
      this[index].isDisposed = true
      this.splice(index, 1)
    }
  }

  public disposeAll(): void {
    this.forEach(x => x.isDisposed = true)
    this.splice(0, this.length)
  }
}
