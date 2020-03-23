import { DevtoolsOptions } from './dev-tools-options'
import { Subscription, throwError } from 'rxjs'
import { DevToolsSubjects } from './dev-tools-subjects'
import { StoreStates } from './store-states.enum'
import { DEFAULT_DEV_TOOLS_OPTIONS } from './default-dev-tools-options'
import { objectAssign, countObjectChanges, instanceHandler, parse, objectKeys, logError } from 'lbrx/helpers'
import { isDev, enableDevToolsUpdates } from 'lbrx/mode'

export class DevToolsManager {

	private _sub = new Subscription()
	private _appState = {}
	private _loadingStoresCache = {}

	constructor(
		private devToolsOptions: Partial<DevtoolsOptions> = {}
	) { }

	public initialize(): void {
		if (!isDev() || !window || !(window as any).__REDUX_DEVTOOLS_EXTENSION__) return
		(window as any).$$stores = DevToolsSubjects.stores
		const mergedOptions = objectAssign(DEFAULT_DEV_TOOLS_OPTIONS, this.devToolsOptions)
		const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(mergedOptions)
		enableDevToolsUpdates()
		this._sub.unsubscribe()
		this._sub = new Subscription()
		this._appState = {}
		const subs = [
			DevToolsSubjects.loadingEvent$.subscribe(storeName => {
				this._appState = objectAssign(this._appState, { [storeName]: StoreStates.loading })
				devTools.send({ type: `[${storeName}] - Loading...` }, this._appState)
			}),
			DevToolsSubjects.initEvent$.subscribe(store => {
				if (this._appState[store.name] && this._appState[store.name] !== StoreStates.loading) {
					const errorMsg = `There are multiple store with the same store name: "${store.name}"!`
					isDev() ? throwError(errorMsg) : logError(errorMsg)
				}
				this._appState = objectAssign(this._appState, { [store.name]: store.state })
				devTools.send({ type: `[${store.name}] - @@INIT` }, this._appState)
			}),
			DevToolsSubjects.overrideEvent$.subscribe(store => {
				this._appState[store.name] = store.state
				devTools.send({ type: `[${store.name}] - Override Store` }, this._appState)
			}),
			DevToolsSubjects.updateEvent$.subscribe(store => {
				const changes = countObjectChanges(this._appState[store.name], store.state)
				if (!changes) return
				this._appState = objectAssign(this._appState, { [store.name]: store.state })
				devTools.send(
					{ type: `[${store.name}] - ${store.updateName ? store.updateName : 'Update Store'} (${changes} changes)` },
					this._appState)
			}),
			DevToolsSubjects.resetEvent$.subscribe(store => {
				this._appState[store.name] = store.state
				devTools.send({ type: `[${store.name}] - Reset Store` }, this._appState)
			}),
			devTools.subscribe((message: any) => {
				if (message.type != 'DISPATCH' || !message.state) return
				const devToolsState = parse<{}>(message.state)
				objectKeys(devToolsState).forEach((storeName: string) => {
					const store = DevToolsSubjects.stores[storeName]
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
							store._setState(() => instanceHandler(store.value || loadingStoresCache[storeName], devToolsStoreValue))
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
