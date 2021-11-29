import { Storages, Store, StoreConfig } from 'lbrx'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { UiStore } from 'src/stores/ui.store'

export function getNewTaskItemModel(): TaskItemModel {
  return {
    id: 0,
    name: ``,
    isCompleted: false,
    description: null,
    dueDate: null,
  }
}

function resolveInitialValue(): TaskItemModel | null {
  return STORES.get(UiStore).value.isTaskFormOpen ? getNewTaskItemModel() : null
}

@StoreConfig({
  name: `TASK-ITEM`,
  storageType: Storages.session,
  storageKey: `TASK-ITEM-STORE`,
  storageDebounceTime: 1000,
})
export class TaskItemStore extends Store<TaskItemModel> {
  constructor() {
    super(resolveInitialValue())
  }
}
