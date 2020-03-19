import { DevtoolsOptions, initLbrxDevTools } from './dev-tools'
import { enableProdMode } from './mode'
import { throwError } from 'lbrx/helpers'
import { GlobalStoreConfigOptions } from './stores/config/global-store-config-options'
import { setGlobalStoreConfig } from './stores/config/global-store-config'

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
		initLbrxDevTools(devToolsOptions)
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
