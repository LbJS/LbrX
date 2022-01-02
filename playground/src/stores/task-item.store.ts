import { Actions, Storages, Store, StoreConfig } from 'lbrx'
import { cloneObject, isDate, isString, newDate } from 'lbrx/utils'
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
  public setDueDate = (dueDate: Date | null) => {
    const currDueDate = this.value.dueDate
    if (!currDueDate || !dueDate) {
      this.update({ dueDate })
      return
    }
    const newCurrDueDate = isDate(currDueDate) ? cloneObject(currDueDate) : newDate(currDueDate)
    newCurrDueDate.setFullYear(dueDate.getFullYear())
    newCurrDueDate.setMonth(dueDate.getMonth())
    newCurrDueDate.setDate(dueDate.getDate())
    this.update({ dueDate: newCurrDueDate })
  }

  protected onStateChange(
    _: Actions | string,
    nextState: TaskItemModel | null,
  ): void | TaskItemModel {
    if (!nextState || !isString(nextState.dueDate)) return
    nextState.dueDate = newDate(nextState.dueDate)
    return nextState
  }
}
