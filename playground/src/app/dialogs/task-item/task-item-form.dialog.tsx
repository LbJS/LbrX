import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Subscriber } from 'rxjs'
import TaskItemFormContent from 'src/app/components/task-item/task-item-form-content.component'
import Dialog from 'src/generic-components/dialog/dialog.component'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { TaskItemStore } from 'src/stores/task-items.store'
import { UiStore } from 'src/stores/ui.store'
import './task-item-form.dialog.scss'

type TaskItemModelState = [TaskItemModel | null, Dispatch<SetStateAction<TaskItemModel | null>>]

export default function TaskItemFormDialog(): JSX.Element {
  const uiStore: UiStore = STORES.get(UiStore)
  const taskItemStore: TaskItemStore = STORES.get(TaskItemStore)
  const modalRef = useRef<M.Modal>()
  const [taskItem, setTaskItem]: TaskItemModelState = useState<TaskItemModel | null>(null)
  const sub = new Subscriber()

  useEffect(() => {
    subscribeToTaskItem()
    return () => {
      sub.unsubscribe()
    }
  }, [])

  function subscribeToTaskItem(): void {
    sub.add(taskItemStore.get$().subscribe(setTaskItem))
  }

  const taskFormDialogOptions: Partial<M.ModalOptions> = {
    onCloseEnd: () => updateIsTaskFormOpen(false)
  }

  function updateIsTaskFormOpen(isTaskFormOpen: boolean): void {
    uiStore.update({ isTaskFormOpen }, `${TaskItemFormDialog.name}->${isTaskFormOpen ? `open` : `close`}-task-from`)
  }

  return <Dialog modalOptions={taskFormDialogOptions}
    modalClasses={[`task-item-form-dialog`]}
    header={taskItem?.id ? `Task ${taskItem.id}` : `New Task`}
    content={<TaskItemFormContent></TaskItemFormContent>}
    modalRef={modalRef}></Dialog>
}
