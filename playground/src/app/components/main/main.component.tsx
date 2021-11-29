import Btn from 'src/generic-components/btn/btn'
import { STORES } from 'src/services/stores.service'
import { getNewTaskItemModel, TaskItemStore } from 'src/stores/task-items.store'
import { UiStore } from 'src/stores/ui.store'
import './main.component.scss'

export default function Main(): JSX.Element {
  const uiStore: UiStore = STORES.get(UiStore)
  const taskItemStore: TaskItemStore = STORES.get(TaskItemStore)
  const newTaskItem = getNewTaskItemModel()

  async function openAddTaskForm(): Promise<void> {
    if (taskItemStore.isInitialized && taskItemStore.value.id) {
      await taskItemStore.hardReset()
      initTaskItemStoreLazily()
    } else if (!taskItemStore.isInitialized) {
      initTaskItemStoreLazily()
    }
    uiStore.update({ isTaskFormOpen: true }, `${Main.name}->open-task-form`)
  }

  function initTaskItemStoreLazily(): void {
    taskItemStore.initializeLazily(Promise.resolve(newTaskItem))
  }

  return <main style={{ display: `flex` }}>
    <div className="container"
      style={{ position: `relative` }}>
      <div className="add-task-btn">
        <Btn classList={[`cyan`, `lighten-2`, `btn-floating`, `btn-large`]}
          action={openAddTaskForm}
          icon="add"></Btn>
      </div>
    </div>
  </main>
}
