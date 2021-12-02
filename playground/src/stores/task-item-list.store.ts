import { ListStore, ListStoreConfig, Storages } from 'lbrx'
import { TaskItemModel } from 'src/models/task-item.model'

@ListStoreConfig({
  name: `TASK-ITEM-LIST`,
  storageType: Storages.session,
  storageKey: `TASK-ITEM-LIST-STORE`,
  storageDebounceTime: 1000,
  idKey: `id`,
  isClassHandler: false,
})
export class TaskItemListStore extends ListStore<TaskItemModel> {
  constructor() {
    super([])
  }
}
