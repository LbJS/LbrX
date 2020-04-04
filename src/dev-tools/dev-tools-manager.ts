import { DevtoolsOptions } from './dev-tools-options'
import { Subscription } from 'rxjs'
import { DevToolsSubjects } from './dev-tools-subjects'
import { StoreStates } from './store-states.enum'
import { DEFAULT_DEV_TOOLS_OPTIONS } from './default-dev-tools-options'
import { objectAssign, countObjectChanges, instanceHandler, parse, objectKeys, isBrowser } from 'lbrx/helpers'
import { isDev, activateDevToolsPushes } from 'lbrx/mode'

export class DevToolsManager {

	private _sub = new Subscription()
	private _appState: { [storeName: string]: any } = {}
	private _loadingStoresCache = {}
	private _zone = {
		run: (f: any) => f()
	}

	constructor(
		private devToolsOptions: Partial<DevtoolsOptions> = {}
	) { }

	public initialize(): void {
		if (!isDev() || !isBrowser() || !(window as any).__REDUX_DEVTOOLS_EXTENSION__) return
		(window as any).$$stores = DevToolsSubjects.stores
		const devToolsOptions = this.devToolsOptions
		const mergedOptions = objectAssign(DEFAULT_DEV_TOOLS_OPTIONS, devToolsOptions)
		const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(mergedOptions)
		this._sub.unsubscribe()
		this._sub = new Subscription()
		this._appState = {}
		this._setUserEventsSubscribers(devTools)
		this._setDevToolsEventsSubscribers(devTools)
		activateDevToolsPushes()
	}

	private _setUserEventsSubscribers(devTools: any): void {
		const subs = [
			DevToolsSubjects.loadingEvent$.subscribe(storeName => {
				this._appState = objectAssign(this._appState, { [storeName]: StoreStates.loading })
				devTools.send({ type: `[${storeName}] - Loading...` }, this._appState)
			}),
			DevToolsSubjects.initEvent$.subscribe(store => {
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
			DevToolsSubjects.hardResetEvent$.subscribe(storeName => {
				this._appState[storeName] = StoreStates.resetting
				devTools.send({ type: `[${storeName}] - Hard Resetting...` }, this._appState)
			}),
		]
		subs.forEach(sub => this._sub.add(sub))
	}

	// BUG: when forwarding in redux devtools, it creates new records.
	private _setDevToolsEventsSubscribers(devTools: any): void {
		this._sub.add(devTools.subscribe((message: any) => {
			if (message.type != 'DISPATCH' || !message.state) return
			const devToolsState = parse<{}>(message.state)
			objectKeys(devToolsState).forEach((storeName: string) => {
				const store: any = DevToolsSubjects.stores[storeName]
				const devToolsStoreValue = devToolsState[storeName]
				const loadingStoresCache = this._loadingStoresCache
				if (store) {
					if (devToolsStoreValue === StoreStates.loading) {
						if (!loadingStoresCache[storeName]) {
							loadingStoresCache[storeName] = store.value
							this._zone.run(() => {
								store.state = null
								store.isLoading$.next(true)
							})
						}
					} else {
						this._zone.run(() => {
							store._setState(() => instanceHandler(store.value || loadingStoresCache[storeName], devToolsStoreValue))
							store.isLoading && store.isLoading$.next(false)
						})
						if (loadingStoresCache[storeName]) delete loadingStoresCache[storeName]
					}
				}
			})
		}))
	}

	public setDevToolsZone(zone: { run: <T = void>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]) => T }): void {
		this._zone = zone
	}
}
