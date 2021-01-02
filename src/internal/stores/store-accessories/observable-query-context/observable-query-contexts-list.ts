import { Observable } from 'rxjs'
import { ObservableQueryContext } from './observable-query-context.interface'
import { ObservableQueryContextsListApi } from './store-observable-query-context-list-api.interface'

export class ObservableQueryContextsList extends Array<ObservableQueryContext<any>> {

  public set doSkipOneChangeCheck(value: boolean) {
    this.forEach(x => x.doSkipOneChangeCheck = value)
  }

  constructor(private readonly _observableQueryContextsListApi: ObservableQueryContextsListApi) {
    super()
  }

  public push(...items: ObservableQueryContext<any>[]): number {
    if (this._observableQueryContextsListApi.isLazyInitContext()) this._observableQueryContextsListApi.initializeLazily()
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
