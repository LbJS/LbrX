import { isDev } from "../../mode/lbrx-mode"
import { StoreConfigOptions } from "./store-config-options"
import { STORE_CONFIG_KEY } from "./store-config-key"
import { isFunction } from "src/helpers"

const decoratorErrorMsg = `"@StoreConfig" decorator can decorate only a class!`

export function StoreConfig(options: StoreConfigOptions):
	<T extends new (...args: any[]) => {}>(constructor: T) => void {
	return <T extends new (...args: any[]) => {}>(constructor: T): void => {
		if (isFunction(constructor)) {
			constructor[STORE_CONFIG_KEY] = {}
			Object.keys(options).forEach(key => {
				constructor[STORE_CONFIG_KEY][key] = options[key]
			})
		} else if (isDev) {
			throw new Error(decoratorErrorMsg)
		} else {
			console.error(decoratorErrorMsg)
		}
	}
}
