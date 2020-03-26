import { UiStateService, UiStateStore } from 'test-subjects'
import { activateDevToolsPushes, isDevTools, enableProdMode, isDev } from 'lbrx/mode'
import { LbrXManager, GlobalErrorStore } from 'lbrx'
import { getGlobalStoreOptions } from 'lbrx/stores/config'

export default class Provider {

	private static _uiStateStore: UiStateStore = new UiStateStore()
	private static _uiStateService: UiStateService = new UiStateService(Provider._uiStateStore)
	private static content = {
		UiStateService: Provider._uiStateService,
		activateDevToolsPushes,
		isDevTools,
		enableProdMode,
		isDev,
		LbrXManager,
		getGlobalStoreOptions,
		GlobalErrorStore,
	}

	private constructor() { }

	public static provide<T>(token: string): T | never {
		const value = Provider.content[token]
		if (!value) throw new Error(`Invalid token: ${token}`)
		return value
	}
}
