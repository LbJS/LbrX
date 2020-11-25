import { HandleClasses, State } from '../stores/store-accessories'

export interface StoreDevToolsApi {
  isClassHandler: boolean
  instancedValue: Readonly<object> | null
  handleClasses: HandleClasses
  setState(state: State<any>): void
}
