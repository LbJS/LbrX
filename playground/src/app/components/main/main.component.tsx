import { UiService } from 'src/app/services/ui.service'
import Btn from 'src/generic-components/add-btn/btn'
import './main.component.scss'

export default function Main(): JSX.Element {
  const uiService: UiService = UiService.getUiService()

  function openAddTaskForm(): void {
    uiService.uiStore.update({ isTaskFormOpen: true }, `main->open-task-form`)
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
