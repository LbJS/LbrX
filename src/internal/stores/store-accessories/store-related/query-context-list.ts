import { BaseStore } from '../../base-store'
import { LazyInitContext } from './lazy-init-context.interface'
import { QueryContext } from './query-context.interface'

// TODO: fix array type
export class QueryContextList extends Array<QueryContext> {

  constructor(private readonly _store: BaseStore<any, any>) {
    super()
  }

  public push(...items: QueryContext[]): number {
    const lazyInitContext: LazyInitContext<any> | null = this._store[`_lazyInitContext`]
    if (lazyInitContext) {
      this._store.initializeAsync(lazyInitContext.value)
        .then(d => lazyInitContext.resolve(d))
        .catch(e => lazyInitContext.reject(e))
      this._store[`_lazyInitContext`] = null
    }
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
