import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import TaskItemFormDialog from 'src/app/dialogs/task-item/task-item-form.dialog'
import { STORES } from 'src/services/stores.service'
import { UiStore } from 'src/stores/ui.store'
import Footer from './components/footer/footer.component'
import Header from './components/header/header.component'
import Main from './components/main/main.component'

type IsTaskFormOpenState = [boolean, Dispatch<SetStateAction<boolean>>]

export default function App(): JSX.Element {
  const uiStore: UiStore = STORES.get(UiStore)
  const [isTaskItemFormDialogOpen, setIsTaskFormOpen]: IsTaskFormOpenState = useState<boolean>(false)

  useEffect(() => {
    subscribeToIsTaskFormOpen()
    setBaseUrl()
  }, [])

  function subscribeToIsTaskFormOpen(): void {
    uiStore.get$(value => value.isTaskFormOpen).subscribe(setIsTaskFormOpen)
  }

  function setBaseUrl(): void {
    const baseUrl = document.getElementsByTagName(`base`)[0].href
    window.history.replaceState({}, document.title, baseUrl)
  }

  return <React.StrictMode>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
    {isTaskItemFormDialogOpen && <TaskItemFormDialog></TaskItemFormDialog>}
  </React.StrictMode>
}
