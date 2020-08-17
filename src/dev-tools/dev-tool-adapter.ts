import { Subject } from 'rxjs'
import { BaseStore } from '../stores'
import { StateChangeInfo } from './state-change-info.interface'

export class DevToolsAdapter {
  public static readonly stores: Record<string, BaseStore<any>> = {}
  public static readonly stateChange$ = new Subject<StateChangeInfo>()
}
