import { HandleTypes, State } from '../stores/store-accessories'

export interface StoreDevToolsApi {
  isInstanceHandler: boolean
  instancedValue: Readonly<object> | null
  handleTypes: HandleTypes
  setState(state: State<any>): void
}
