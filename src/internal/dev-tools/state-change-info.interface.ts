import { Actions, State } from '../stores/store-accessories'

export interface StateChangeInfo {
  storeName: string,
  state: State<any>
  actionName: string | Actions
}
