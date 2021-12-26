import { Storages, Store, StoreConfig } from 'lbrx'
import { TaskItemModel } from 'src/models/task-item.model'

export function getNewTaskItemModel(): TaskItemModel {
  return {
    id: 0,
    title: ``,
    isCompleted: false,
    description: null,
    dueDate: null,
  }
}

@StoreConfig({
  name: `TASK-ITEM`,
  storageType: Storages.session,
  storageKey: `TASK-ITEM-STORE`,
  storageDebounceTime: 1000,
})
export class TaskItemStore extends Store<TaskItemModel> {
  constructor() {
    super(null)
  }

  public setTitle = (title: string) => this.update({ title })
  public setIsCompleted = (isCompleted: boolean) => this.update({ isCompleted })
  public setDescription = (description: string) => this.update({ description })
  public setDueDate = (dueDate: Date | null) => this.update({ dueDate })
}
