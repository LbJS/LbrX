import { DevtoolsOptions, initLbrxDevTools } from './dev-tools'
import { enableProdMode } from './mode'
import { throwError } from 'lbrx/helpers'

/**
 * LbrX static builder class.
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

	constructor() {
		throwError('LbrXManager class is an static class, no instance is allowed.')
	}
}
