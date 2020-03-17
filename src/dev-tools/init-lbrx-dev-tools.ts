import { DevtoolsOptions } from './dev-tools-options'
import { DevToolsManager } from './dev-tools-manager'

export function initLbrxDevTools(devToolsOptions?: Partial<DevtoolsOptions>): void {
	new DevToolsManager(devToolsOptions).initialize()
}
