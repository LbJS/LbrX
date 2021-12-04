import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Subscriber } from 'rxjs'
import Btn from 'src/generic-components/btn/btn'
import Dialog from 'src/generic-components/dialog/dialog.component'
import FormField from 'src/generic-components/form-field/form-field.component'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { getNewTaskItemModel, TaskItemStore } from 'src/stores/task-item.store'
import { UiStore } from 'src/stores/ui.store'
import { onChangeHandler } from 'src/utils/on-change-handler'
import './task-item-form.dialog.scss'

export interface TaskItemFormDialogOptions {
  task?: TaskItemModel
}

type TaskItemDispatcher = Dispatch<SetStateAction<TaskItemModel>>
type TaskItemModelState = [TaskItemModel, TaskItemDispatcher]

async function initItemStore(taskItemStore: TaskItemStore, taskItem: TaskItemModel): Promise<void> {
  if (taskItemStore.isInitialized && taskItem.id !== taskItemStore.value.id) {
    await taskItemStore.hardReset()
    taskItemStore.initialize(taskItem)
  } else if (!taskItemStore.isInitialized) {
    taskItemStore.initialize(taskItem)
  }
}

export default function TaskItemFormDialog({ task }: TaskItemFormDialogOptions): JSX.Element {
  const sub = useMemo(() => new Subscriber(), [])
  const uiStore: UiStore = useMemo(() => STORES.get(UiStore), [])
  const taskItemStore: TaskItemStore = useMemo(() => STORES.get(TaskItemStore), [])
  const taskFormDialogOptions: Partial<M.ModalOptions> = useMemo(() => ({
    onCloseEnd: () => modalCloseCb()
  }), [])

  const modalRef = useRef<M.Modal>()

  const [taskItem, setTaskItem]: TaskItemModelState = useState<TaskItemModel>(task || getNewTaskItemModel())

  const subscribeToTaskItem = useCallback(() => sub.add(taskItemStore.get$().subscribe(setTaskItem)), [])
  const componentCleanUp = useCallback(() => { sub.unsubscribe() }, [])
  const modalCloseCb = useCallback(() => uiStore.closeTaskForm(`close-task-form`), [])
  const saveTask = useCallback(() => console.log(taskItem), [])
  const closeForm = useCallback(() => modalRef.current?.close(), [])
  const clearForm = useCallback(() => taskItemStore.set(getNewTaskItemModel()), [])

  useEffect(() => {
    initItemStore(taskItemStore, taskItem).then(subscribeToTaskItem)
    return componentCleanUp
  }, [])

  return <Dialog modalOptions={taskFormDialogOptions}
    modalClasses={[`task-item-form-dialog`]}
    header={taskItem.id ? `Task ${taskItem.id}` : `New Task`}
    headerClasses={[`cyan`, `darken-1`]}
    content={<div>
      <FormField>
        <React.Fragment>
          <input type="text" value={taskItem.title} onChange={onChangeHandler(taskItemStore.setTitle)} />
          <label>Title</label>
        </React.Fragment>
      </FormField>
    </div>}
    footer={<React.Fragment>
      <Btn action={clearForm}
        classList={[`btn-flat`]}>Clear</Btn>
      <Btn action={saveTask}>Save</Btn>
      <Btn action={[saveTask, closeForm]}>Save & Close</Btn>
    </React.Fragment>}
    footerClasses={[`btns-container-pull-right`]}
    modalRef={modalRef}></Dialog>
}
