import { UiService } from 'src/app/services/ui.service'
import AddBtn from 'src/components/add-btn/add-btn'
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
        <AddBtn classList={[`cyan`, `lighten-2`]} action={openAddTaskForm}></AddBtn>
      </div>
    </div>
  </main>
}
