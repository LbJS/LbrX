import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import TaskItemFormDialog from 'src/app/dialogs/task-item/task-item-form.dialog'
import { UiService } from 'src/app/services/ui.service'
import Footer from './components/footer/footer.component'
import Header from './components/header/header.component'
import Main from './components/main/main.component'

type IsTaskFormOpenState = [boolean, Dispatch<SetStateAction<boolean>>]

export default function App(): JSX.Element {
  const uiService: UiService = UiService.getUiService()
  const [isTaskItemFormDialogOpen, setIsTaskFormOpen]: IsTaskFormOpenState = useState<boolean>(false)

  useEffect(() => {
    subscribeToIsTaskFormOpen()
  }, [])

  function subscribeToIsTaskFormOpen(): void {
    uiService.uiStore.get$(value => value.isTaskFormOpen).subscribe(setIsTaskFormOpen)
  }

  return <React.StrictMode>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
    {isTaskItemFormDialogOpen && <TaskItemFormDialog></TaskItemFormDialog>}
  </React.StrictMode>
}
