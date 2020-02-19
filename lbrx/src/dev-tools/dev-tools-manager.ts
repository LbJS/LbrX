import { DevtoolsOptions } from "./dev-tools-options"
import { Subscription } from "rxjs"
import { isDev } from "../environment/state-manager.environment"
import { DevTools } from "./dev-tools"
import { objectAssign, countObjChanges, isClass } from "../helpers/helpers"
import { StoreStates } from "./store-states.enum"
import { DEFAULT_DEV_TOOLS_OPTIONS } from "./default-dev-tools-options"

export class DevToolsManager {

	private _sub = new Subscription()
	private _appState = {}
	private _loadingStoresCache = {}

	constructor(
		private devToolsOptions: Partial<DevtoolsOptions> = {}
	) { }

	public initialize(): void {
		if (!isDev || !(window as any).__REDUX_DEVTOOLS_EXTENSION__) return
		(window as any).$$stores = DevTools.Stores
		const mergedOptions = Object.assign(DEFAULT_DEV_TOOLS_OPTIONS, this.devToolsOptions)
		const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(mergedOptions)
		this._sub.unsubscribe()
		this._sub = new Subscription()
		this._appState = {}
		const subs = [
			DevTools.LoadingStore$.subscribe(storeName => {
				this._appState = objectAssign(this._appState, { [storeName]: StoreStates.loading })
				devTools.send({ type: `[${storeName}] - Loading...` }, this._appState)
			}),
			DevTools.InitStore$.subscribe(store => {
				if (this._appState[store.name] && this._appState[store.name] !== StoreStates.loading) {
					throw new Error(`There are multiple store with the same store name: "${store.name}"!`)
				}
				this._appState = objectAssign(this._appState, { [store.name]: store.state })
				devTools.send({ type: `[${store.name}] - @@INIT` }, this._appState)
			}),
			DevTools.OverrideStore$.subscribe(store => {
				this._appState[store.name] = store.state
				devTools.send({ type: `[${store.name}] - Override Store` }, this._appState)
			}),
			DevTools.UpdateStore$.subscribe(store => {
				const changes = countObjChanges(this._appState[store.name], store.state)
				if (!changes) return
				this._appState = objectAssign(this._appState, { [store.name]: store.state })
				devTools.send(
					{ type: `[${store.name}] - ${store.updateName ? store.updateName : 'Update Store'} (${changes} changes)` },
					this._appState)
			}),
			DevTools.ResetStore$.subscribe(store => {
				this._appState[store.name] = store.state
				devTools.send({ type: `[${store.name}] - Reset Store` }, this._appState)
			}),
			devTools.subscribe((message: any) => {
				if (message.type != 'DISPATCH' || !message.state) return
				const devToolsState = JSON.parse(message.state)
				Object.keys(devToolsState).forEach((storeName: string) => {
					const store = DevTools.Stores[storeName]
					const devToolsStoreValue = devToolsState[storeName]
					const loadingStoresCache = this._loadingStoresCache
					if (store) {
						if (devToolsStoreValue === StoreStates.loading) {
							if (!loadingStoresCache[storeName]) {
								loadingStoresCache[storeName] = store.value
								store.state = null
								store.isLoading$.next(true)
							}
						} else {
							store._setState(() => isClass(store.value || loadingStoresCache[storeName]) ?
								objectAssign(new (store.value || loadingStoresCache[storeName]).constructor(), devToolsStoreValue) :
								devToolsStoreValue)
							store.isLoading && store.isLoading$.next(false)
							if (loadingStoresCache[storeName]) delete loadingStoresCache[storeName]
						}
					}
				})
			})
		]
		subs.forEach(sub => this._sub.add(sub))
	}
}
