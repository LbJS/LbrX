import { DevtoolsOptions, DevToolsManager } from './dev-tools'
import { enableProdMode } from './mode'
import { throwError } from 'lbrx/helpers'
import { GlobalStoreConfigOptions, setGlobalStoreConfig } from './stores/config'

// tslint:disable: no-redundant-jsdoc
/**
 * LbrX static builder class.
 * @static
 */
export class LbrXManager {

	/**
	 * Enabling production mode will improve performance and
	 * will log errors instead of throwing them.
	 */
	static enableProdMode(): LbrXManager {
		enableProdMode()
		return LbrXManager
	}

	/**
	 * Initializes Redux DevTools.
	 */
	static initializeDevTools(devToolsOptions?: Partial<DevtoolsOptions>): LbrXManager {
		new DevToolsManager(devToolsOptions).initialize()
		return LbrXManager
	}

	/**
	 * Sets global store configuration for all stores.
	 */
	static setGlobalStoreConfig(options: GlobalStoreConfigOptions): LbrXManager {
		setGlobalStoreConfig(options)
		return LbrXManager
	}

	constructor() {
		throwError('LbrXManager class is an static class, no instance is allowed.')
	}
}
