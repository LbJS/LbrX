import { Actions, State } from '../stores'

export interface StateChangeInfo {
  storeName: string,
  state: State<any>
  actionName: string | Actions
}
