import { Storages, Store, StoreConfig } from 'lbrx'
import { isObject, isString } from 'lbrx/utils'
import { TaskItemModel } from 'src/models/task-item.model'

export interface UiState {
  taskFormState: TaskFormState
}

export interface TaskFormState {
  isTaskFormOpen: boolean
  taskPayload: TaskItemModel | null
}

function getInitialState(): UiState {
  return {
    taskFormState: {
      isTaskFormOpen: false,
      taskPayload: null,
    }
  }
}

type OpenTaskFormOverloads = {
  (actionName?: string): void,
  (taskPayload: TaskItemModel, actionName?: string): void,
}

@StoreConfig({
  name: `UI`,
  storageType: Storages.session,
  storageKey: `UI-STORE`,
  storageDebounceTime: 500,
})
export class UiStore extends Store<UiState> {

  public openTaskForm: OpenTaskFormOverloads = (taskPayloadOrActionName?: TaskItemModel | string, actionName?: string) => {
    if (isString(taskPayloadOrActionName)) actionName = taskPayloadOrActionName
    this.update({
      taskFormState: {
        isTaskFormOpen: true,
        taskPayload: isObject(taskPayloadOrActionName) ? taskPayloadOrActionName : null,
      }
    }, actionName)
  }

  public closeTaskForm = (actionName?: string) => {
    this.update({
      taskFormState: {
        isTaskFormOpen: false,
        taskPayload: null,
      }
    }, actionName)
  }

  constructor() {
    super(getInitialState())
  }
}
