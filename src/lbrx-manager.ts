import { enableProdMode } from "./mode/state-manager.mode"
import { DevtoolsOptions, initLbrxDevTools } from "./dev-tools"

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
