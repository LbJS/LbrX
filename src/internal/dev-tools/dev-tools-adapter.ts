import { Subject } from 'rxjs'
import { BaseStore } from '../stores'
import { State } from '../stores/store-accessories'
import { KeyValue } from '../types'
import { StateChangeInfo } from './state-change-info.interface'

export class DevToolsAdapter {
  public static readonly stores: KeyValue<string, BaseStore<any>> = {}
  public static readonly states: KeyValue<string, State<any>> = {}
  public static readonly values: KeyValue<string, {} | null> = {}
  public static readonly stateChange$ = new Subject<StateChangeInfo>()
}
