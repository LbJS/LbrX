import { Subject } from 'rxjs'
import { DevToolsDataStruct } from './store-dev-object'

export class DevToolsSubjects {
  public static readonly stores: { [storeName: string]: any } = {}
  public static readonly loadingEvent$ = new Subject<string>()
  public static readonly initEvent$ = new Subject<DevToolsDataStruct>()
  public static readonly overrideEvent$ = new Subject<DevToolsDataStruct>()
  public static readonly updateEvent$ = new Subject<DevToolsDataStruct>()
  public static readonly resetEvent$ = new Subject<DevToolsDataStruct>()
  public static readonly hardResetEvent$ = new Subject<string>()
  // TODO: Find other solution to prevent errors on self updating store when playing with REDUX DevTools timeline.
  public static isLoadingErrorsDisabled = false
}
