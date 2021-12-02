import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import TaskItemFormDialog from 'src/app/dialogs/task-item/task-item-form.dialog'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { TaskItemListStore } from 'src/stores/task-item-list.store'
import { UiStore } from 'src/stores/ui.store'
import Footer from './components/footer/footer.component'
import Header from './components/header/header.component'
import Main from './components/main/main.component'

type IsTaskFormOpenState = [boolean, Dispatch<SetStateAction<boolean>>]

export default function App(): JSX.Element {
  const uiStore: UiStore = STORES.get(UiStore)
  const tasksListStore: TaskItemListStore = STORES.get(TaskItemListStore)
  const [isTaskItemFormDialogOpen, setIsTaskFormOpen]: IsTaskFormOpenState = useState<boolean>(false)

  useEffect(() => {
    subscribeToIsTaskFormOpen()
    setBaseUrl()
    if (!tasksListStore.value.length) tasksListStore.add(createInitialTasks())
  }, [])

  function subscribeToIsTaskFormOpen(): void {
    uiStore.get$(value => value.isTaskFormOpen).subscribe(setIsTaskFormOpen)
  }

  function setBaseUrl(): void {
    const baseUrl = document.getElementsByTagName(`base`)[0].href
    window.history.replaceState({}, document.title, baseUrl)
  }

  function createInitialTasks(): TaskItemModel[] {
    return [
      {
        id: 1,
        title: `Create your first task.`,
        description: ``,
        dueDate: null,
        isCompleted: false,
      }
    ]
  }

  return <React.StrictMode>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
    {isTaskItemFormDialogOpen && <TaskItemFormDialog></TaskItemFormDialog>}
  </React.StrictMode>
}
