import { useRef } from 'react'
import TaskItemFormContent from 'src/app/components/task-item/task-item-form-content.component'
import { UiService } from 'src/app/services/ui.service'
import Dialog from 'src/generic-components/dialog/dialog.component'
import './task-item-form.dialog.scss'

export default function TaskItemFormDialog(): JSX.Element {
  const uiService: UiService = UiService.getUiService()
  const modalRef = useRef<M.Modal>()

  const taskFormDialogOptions: Partial<M.ModalOptions> = {
    onCloseEnd: () => updateIsTaskFormOpen(false)
  }

  function updateIsTaskFormOpen(isTaskFormOpen: boolean): void {
    uiService.uiStore.update({ isTaskFormOpen }, `${TaskItemFormDialog.name}->${isTaskFormOpen ? `open` : `close`}-task-from`)
  }

  return <Dialog modalOptions={taskFormDialogOptions}
    modalClasses={[`task-item-form-dialog`]}
    header="New Task"
    content={<TaskItemFormContent></TaskItemFormContent>}
    modalRef={modalRef}></Dialog>
}
