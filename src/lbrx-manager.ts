import { DevtoolsOptions, DevToolsManager } from './dev-tools'
import { enableProdMode } from './mode'
import { GlobalStoreConfigOptions, setGlobalStoreConfig } from './stores/config'

// tslint:disable: no-redundant-jsdoc
/**
 * LbrX static class.
 * @static
 */
export class LbrXManager {

	/**
	 * Enabling production mode will improve performance and
	 * will log errors instead of throwing them.
	 */
	static enableProdMode(): typeof LbrXManager {
		enableProdMode()
		return LbrXManager
	}

	/**
	 * Initializes Redux DevTools.
	 */
	static initializeDevTools(devToolsOptions?: Partial<DevtoolsOptions>): typeof LbrXManager {
		new DevToolsManager(devToolsOptions).initialize()
		return LbrXManager
	}

	/**
	 * Sets global store configuration for all stores.
	 */
	static setGlobalStoreConfig(options: GlobalStoreConfigOptions): typeof LbrXManager {
		setGlobalStoreConfig(options)
		return LbrXManager
	}

	private constructor() { }
}
