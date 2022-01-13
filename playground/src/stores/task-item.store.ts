import { Actions, Storages, Store, StoreConfig } from 'lbrx'
import { cloneObject, isDate, isString, isUndefined, newDate } from 'lbrx/utils'
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

interface SetDueDate {
  (dueDate: Date | null): void
  (dueDate: Date | null, hours: number, minutes: number): void
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
  public setDueDate: SetDueDate = (dueDate: Date | null, hours?: number, minutes?: number) => {
    const currDueDate = this.value.dueDate
    const isTimeSelected = !isUndefined(hours) && !isUndefined(minutes)
    if (!dueDate && isTimeSelected) dueDate = newDate()
    if (!dueDate) return this.update({ dueDate })
    const nextDate = isDate(currDueDate) ? cloneObject(currDueDate) : newDate(currDueDate ?? dueDate)
    nextDate.setFullYear(dueDate.getFullYear())
    nextDate.setMonth(dueDate.getMonth())
    nextDate.setDate(dueDate.getDate())
    if (hours) nextDate.setHours(hours)
    if (minutes) nextDate.setHours(minutes)
    this.update({ dueDate: nextDate })
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
