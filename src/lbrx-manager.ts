import { DevtoolsOptions, DevToolsManager } from './dev-tools'
import { enableProdMode } from './mode'
import { GlobalStoreConfigOptions, setGlobalStoreConfig } from './stores/config'

// tslint:disable: no-redundant-jsdoc
/**
 * LbrX static class.
 * @static
 */
export class LbrXManager {

	private static _devToolsManager: DevToolsManager | null = null

	/**
	 * Enabling production mode will improve performance and
	 * will log errors instead of throwing them.
	 */
	static enableProdMode(): typeof LbrXManager {
		enableProdMode()
		return this
	}

	/**
	 * Initializes Redux DevTools.
	 */
	static initializeDevTools(devToolsOptions?: Partial<DevtoolsOptions>): typeof LbrXManager {
		this._devToolsManager = new DevToolsManager(devToolsOptions)
		this._devToolsManager.initialize()
		return this
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
	static setDevToolsZone(zone: { run: <T = void>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]) => T }): typeof LbrXManager {
		this._devToolsManager?.setDevToolsZone(zone)
		return this
	}

	/**
	 * Sets global store configuration for all stores.
	 */
	static setGlobalStoreConfig(options: GlobalStoreConfigOptions): typeof LbrXManager {
		setGlobalStoreConfig(options)
		return this
	}

	private constructor() { }
}
