import { BaseStore } from '../../base-store'
import { LazyInitContext } from './lazy-init-context.interface'
import { QueryContext } from './query-context.interface'

export class QueryContextList {

  public get length(): number {
    return this._queryContextList.length
  }

  private readonly _queryContextList: QueryContext[] = []
  private readonly _store: BaseStore<any, any>

  constructor(store: BaseStore<any, any>) {
    this._store = store
  }

  public push(...items: QueryContext[]): number {
    const lazyInitContext: LazyInitContext<any> | null = this._store[`_lazyInitContext`]
    if (lazyInitContext) {
      this._store.initializeAsync(lazyInitContext.value)
        .then(d => lazyInitContext.resolve(d))
        .catch(e => lazyInitContext.reject(e))
      this._store[`_lazyInitContext`] = null
    }
    return this._queryContextList.push(...items)
  }

  public forEach(callbackfn: (value: QueryContext, index: number, array: QueryContext[]) => void, thisArg?: any): void {
    this._queryContextList.forEach(callbackfn, thisArg)
  }

  public findIndex(predicate: (value: QueryContext, index: number, obj: QueryContext[]) => unknown, thisArg?: any): number {
    return this._queryContextList.findIndex(predicate, thisArg)
  }

  public disposeByIndex(index: number): void {
    this._queryContextList[index].isDisposed = true
    this._queryContextList.splice(index, 1)
  }

  public disposeAll(): void {
    this._queryContextList.forEach(x => x.isDisposed = true)
    this._queryContextList.splice(0, this._queryContextList.length)
  }
}
