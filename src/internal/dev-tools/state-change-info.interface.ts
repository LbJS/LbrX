import { Actions } from '../stores'

export interface StateChangeInfo {
  storeName: string,
  state: {}
  actionName: string | Actions
}
