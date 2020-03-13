import { DevtoolsOptions, initLbrxDevTools } from "./dev-tools"
import { enableProdMode } from "./mode"

export class LbrXManager {

	static enableProdMode(): LbrXManager {
		enableProdMode()
		return LbrXManager
	}

	static initializeDevTools(devToolsOptions?: Partial<DevtoolsOptions>): LbrXManager {
		initLbrxDevTools(devToolsOptions)
		return LbrXManager
	}
}
