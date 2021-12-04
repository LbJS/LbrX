import { Storages, Store, StoreConfig } from 'lbrx'

export interface UiState {
  isTaskFormOpen: boolean
}

function getInitialState(): UiState {
  return {
    isTaskFormOpen: false
  }
}

@StoreConfig({
  name: `UI`,
  storageType: Storages.session,
  storageKey: `UI-STORE`,
  storageDebounceTime: 500,
})
export class UiStore extends Store<UiState> {

  public openTaskForm = (actionName?: string) => {
    this.update({ isTaskFormOpen: true }, actionName)
  }

  public closeTaskForm = (actionName?: string) => {
    this.update({ isTaskFormOpen: false }, actionName)
  }

  constructor() {
    super(getInitialState())
  }
}
