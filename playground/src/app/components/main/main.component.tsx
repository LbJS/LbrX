import { useCallback, useMemo } from 'react'
import TasksList from 'src/app/components/tasks-list/tasks-list'
import Btn from 'src/generic-components/btn/btn'
import { STORES } from 'src/services/stores.service'
import { UiStore } from 'src/stores/ui.store'
import './main.component.scss'

export default function Main(): JSX.Element {
  const uiStore: UiStore = useMemo(() => STORES.get(UiStore), [])

  const openAddTaskForm = useCallback(() => uiStore.openTaskForm(), [])

  return <main style={{ display: `flex` }}>
    <div className="container"
      style={{ position: `relative` }}>
      <TasksList></TasksList>
      <div className="add-task-btn">
        <Btn classList={[`cyan`, `lighten-2`, `btn-floating`, `btn-large`]}
          action={openAddTaskForm}
          icon="add"></Btn>
      </div>
    </div>
  </main>
}
