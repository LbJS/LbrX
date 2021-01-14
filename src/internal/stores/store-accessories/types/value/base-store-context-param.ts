import { Observable } from 'rxjs'
import { BaseStore } from '../../../base-store'
import { Actions } from '../../actions'
import { ObservableQueryContext, ObservableQueryContextsList } from '../../observable-query-context'
import { ValueObservableMethodParam } from './value-observable-method-param'

export type BaseStoreContextParam<T extends object, M extends object> = {
  baseStore: BaseStore<T, M>,
  get$: (value: ValueObservableMethodParam<T, T>) => Observable<T>,
  queryContextList: Array<ObservableQueryContext<any>> & ObservableQueryContextsList,
  saveActionName?: string,
  onActionOrActions?: Actions | string | (Actions | string)[]
}
