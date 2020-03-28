import { Store, StoreConfig } from 'lbrx'
import { UiState } from './ui-state.model'

export function createInitialUiState(): UiState {
	return {
		isSideNavOpen: true,
		isSearchBarVisible: true,
		isContextMenuActive: false,
		lastActiveDate: new Date(2020, 0),
		status: 'active',
	}
}

@StoreConfig({
	name: 'UI-STATE-STORE'
})
export class UiStateStore extends Store<UiState, Error> {

	constructor() {
		super(createInitialUiState())
	}
}
