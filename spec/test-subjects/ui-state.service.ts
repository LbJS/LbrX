import { UiStateStore } from './ui-state-store'
import { UiState } from './ui-state.model'

export class UiStateService {

	public get value(): UiState {
		return this.store.value
	}

	public state$ = this.store.select()

	constructor(
		public store: UiStateStore
	) { }
}
