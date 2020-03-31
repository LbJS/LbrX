import { UiStateStore, NullStateStore } from 'test-subjects'
import { activateDevToolsPushes, isDevTools, enableProdMode, isDev } from 'lbrx/mode'
import { LbrXManager, GlobalErrorStore, Store } from 'lbrx'
import { getGlobalStoreConfig } from 'lbrx/stores/config'

export default class Provider {

	private static _uiStateStore: UiStateStore = new UiStateStore()
	private static _nullStateStore: NullStateStore = new NullStateStore()
	private static content = {
		UiStateStore: Provider._uiStateStore,
		NullStateStore: Provider._nullStateStore,
		activateDevToolsPushes,
		isDevTools,
		enableProdMode,
		isDev,
		LbrXManager,
		getGlobalStoreConfig,
		GlobalErrorStore,
		Store,
	}

	private constructor() { }

	public static provide<T>(token: string): T | never {
		const value = Provider.content[token]
		if (!value) throw new Error(`Invalid token: ${token}`)
		return value
	}
}
