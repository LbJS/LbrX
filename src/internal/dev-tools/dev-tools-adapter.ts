import { Subject } from 'rxjs'
import { BaseStore } from '../stores'
import { KeyValue } from '../types'
import { StateChangeInfo } from './state-change-info.interface'

export class DevToolsAdapter {
  public static readonly stores: KeyValue<string, BaseStore<any>> = {}
  public static readonly state: KeyValue<string, {}> = {}
  public static readonly values: KeyValue<string, {} | null> = {}
  public static readonly stateChange$ = new Subject<StateChangeInfo>()
}
