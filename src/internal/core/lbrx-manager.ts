import { DevToolsManager } from '../dev-tools'
import { DevtoolsOptions } from '../dev-tools/config'
import { logError } from '../helpers'
import { GlobalListStoreConfigOptions, GlobalStoreConfigOptions, setGlobalListStoreConfig, setGlobalStoreConfig } from '../stores/config'
import { ZoneLike } from '../types'
import { enableProdMode } from './lbrx-mode'
import { enableStackTracingErrors } from './stack-tracing-errors'

/**
 * LbrX static class.
 * @static
 */
export class LbrXManager {

  private static _devToolsManager: DevToolsManager | null = null

  /**
   * Enabling production mode will improve performance.
   * - Stores will not send the state to the development tools.
   * - Values that were readonly at the store, will no longer be readonly in production mode.
   */
  public static enableProdMode(): typeof LbrXManager {
    enableProdMode()
    return LbrXManager
  }

  /**
   * Enables stack-tracing errors.
   */
  public static enableStackTracingErrors(): typeof LbrXManager {
    enableStackTracingErrors()
    return LbrXManager
  }

  /**
   * Initializes Redux DevTools.
   */
  public static initializeDevTools(devToolsOptions?: Partial<DevtoolsOptions>): typeof LbrXManager {
    LbrXManager._devToolsManager = new DevToolsManager(devToolsOptions)
    LbrXManager._devToolsManager.initialize()
    return LbrXManager
  }

  /**
   * Set a zone function that will run callbacks from Redux DevTools events.
   * @example
   * `Angular:`
   * class AppComponent implements OnInit {
   * 	constructor(private _zone: NgZone) { }
   * 	ngOnInit() {
   * 		LbrXManager.setDevToolsZone(this._zone)
   * 	}
   * `Other:`
   * LbrXManager.setDevToolsZone(someZoneHandler)
   */
  public static setDevToolsZone(
    zone: ZoneLike
  ): typeof LbrXManager {
    if (!LbrXManager._devToolsManager) {
      logError(`DevTools must be initialized before setting DevTools Zone.`)
    } else {
      LbrXManager._devToolsManager.setDevToolsZone(zone)
    }
    return LbrXManager
  }

  /**
   * Sets global store configuration for all stores.
   */
  public static setGlobalStoreConfig(options: GlobalStoreConfigOptions): typeof LbrXManager {
    setGlobalStoreConfig(options)
    return LbrXManager
  }

  /**
   * Sets global list store configuration for all stores.
   */
  public static setGlobalListStoreConfig(options: GlobalListStoreConfigOptions): typeof LbrXManager {
    setGlobalListStoreConfig(options)
    return LbrXManager
  }

  private constructor() { }
}
