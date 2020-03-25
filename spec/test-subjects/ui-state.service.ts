import { UiStateStore } from './ui-state-store'
import { UiState } from './ui-state.model'

export class UiStateService {

	public get value(): UiState {
		return this.store.value
	}

	constructor(
		public store: UiStateStore
	) { }
}
