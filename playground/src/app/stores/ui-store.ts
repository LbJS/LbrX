import { Store, StoreConfig } from 'lbrx'

export interface UiState {
  isTaskFormOpen: boolean
}

function getInitialState(): UiState {
  return {
    isTaskFormOpen: false
  }
}

@StoreConfig({
  name: `UI`
})
export class UiStore extends Store<UiState> {
  constructor() {
    super(getInitialState())
  }
}
