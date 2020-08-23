import { Subscription } from 'rxjs'
import { isDev } from '../core'
import { countObjectChanges, filterObject, instanceHandler, isBrowser, logWarn, mergeObjects, objectKeys, parse, simpleCloneObject } from '../helpers'
import { Actions, BaseStore } from '../stores'
import { KeyOf, KeyValue, ZoneLike } from '../types'
import { DevtoolsOptions, ReduxDevToolsOptions } from './config'
import { getDefaultDevToolsConfig } from './default-dev-tools-config'
import { DevToolsAdapter } from './dev-tools-adapter'
import { activateStreamToDevTools } from './dev-tools-mode'
import { ReduxDevToolsExtension } from './redux-dev-tools-extension.interface'
import { ReduxDevToolsMonitor } from './redux-dev-tools-monitor.interface'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: ReduxDevToolsExtension
  }
}

export class DevToolsManager {

  private static _wasInitialized = false

  private _sub = new Subscription()
  private _state: KeyValue = {}
  private _storeLastAction: KeyValue<string, Actions | string> = {}
  private _zone = {
    run: (f: any) => f()
  }
  private _reduxMonitor: ReduxDevToolsMonitor | null = null
  private _reduxDevToolsOptionsKeys: KeyOf<ReduxDevToolsOptions>[] = ['name']
  private _devToolsOptions: Partial<DevtoolsOptions>

  constructor(
    devToolsOptions: Partial<DevtoolsOptions> = {}
  ) {
    this._devToolsOptions = mergeObjects(getDefaultDevToolsConfig(), devToolsOptions)
  }

  public initialize(): void {
    if (!isDev() || !isBrowser() || !window.__REDUX_DEVTOOLS_EXTENSION__ || DevToolsManager._wasInitialized) return
    if (objectKeys(DevToolsAdapter.stores).length) {
      logWarn('DevToolsManager was initialized after one or more stores were created.')
    }
    (window as any).$$LbrX = {
      $$stores: DevToolsAdapter.stores,
      $$state: DevToolsAdapter.state,
      $$values: DevToolsAdapter.values,
    }
    const reduxDevToolsOptions = filterObject(this._devToolsOptions as DevtoolsOptions, this._reduxDevToolsOptionsKeys)
    this._reduxMonitor = window.__REDUX_DEVTOOLS_EXTENSION__.connect(reduxDevToolsOptions)
    this._reduxMonitor.init(this._state)
    this._setSubscribers(this._reduxMonitor)
    activateStreamToDevTools()
    DevToolsManager._wasInitialized = true
  }

  public setDevToolsZone(zone: ZoneLike): void {
    this._zone = zone
  }

  private _setSubscribers(reduxMonitor: ReduxDevToolsMonitor): void {
    const options = this._devToolsOptions
    this._sub.add(DevToolsAdapter.stateChange$.subscribe(x => {
      const clonedState = simpleCloneObject(x.state)
      const numOfChanges = countObjectChanges(this._state[x.storeName], clonedState)
      if (!numOfChanges && this._storeLastAction[x.storeName] == x.actionName && !options.logEqualStates) return
      this._state[x.storeName] = clonedState
      this._storeLastAction[x.storeName] = x.actionName
      reduxMonitor.send(`[${x.storeName}] - ${x.actionName}`, this._state)
    }))
    reduxMonitor.subscribe((message: KeyValue) => {
      if (message.type != 'DISPATCH' || !message.state) return
      const reduxDevToolsState = parse<object>(message.state)
      objectKeys(reduxDevToolsState).forEach((storeName: string) => {
        const store: BaseStore<any> = DevToolsAdapter.stores[storeName]
        if (!store) return
        const reduxDevToolsStoreState = reduxDevToolsState[storeName]
        this._state[storeName] = reduxDevToolsStoreState
        this._zone.run(() => {
          this._setState(store, reduxDevToolsStoreState)
        })
      })
    })
  }

  private _setState(store: BaseStore<any> | any, state: any): void {
    store._state = (store._initialValue && !store._isSimpleCloning) ? instanceHandler(store._initialValue, state) : state
  }
}
