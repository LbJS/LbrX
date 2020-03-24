import { Store, StoreConfig } from 'lbrx'
import { UiState } from './ui-state.model'

function createUiStateModel(): UiState {
	return {
		isSideNavOpen: true
	}
}

@StoreConfig({
	name: 'UI-STATE-STORE'
})
export class UiStateStore extends Store<UiState> {

	constructor() {
		super(createUiStateModel())
	}
}
