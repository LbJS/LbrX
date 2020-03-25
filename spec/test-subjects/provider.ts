import { UiStateService } from './ui-state.service'
import { UiStateStore } from './ui-state-store'

export class Provider {

	private static _uiStateStore: UiStateStore = new UiStateStore()
	private static _uiStateService: UiStateService = new UiStateService(Provider._uiStateStore)
	public static get uiStateService(): UiStateService {
		return this._uiStateService
	}

	private constructor() { }
}
