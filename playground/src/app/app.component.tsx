import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import TaskItemFormDialog from 'src/app/dialogs/task-item/task-item-form.dialog'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { TaskItemListStore } from 'src/stores/task-item-list.store'
import { UiStore } from 'src/stores/ui.store'
import Footer from './components/footer/footer.component'
import Header from './components/header/header.component'
import Main from './components/main/main.component'

type IsTaskOpenDispatcher = Dispatch<SetStateAction<boolean>>
type IsTaskFormOpenState = [boolean, IsTaskOpenDispatcher]

function subscribeToIsTaskFormOpen(uiStore: UiStore, setIsTaskFormOpen: IsTaskOpenDispatcher): void {
  uiStore.get$(value => value.isTaskFormOpen).subscribe(setIsTaskFormOpen)
}

function setBaseUrl(): void {
  const baseUrl = document.getElementsByTagName(`base`)[0].href
  window.history.replaceState({}, document.title, baseUrl)
}

function createInitialTasks(): TaskItemModel[] {
  return [
    createYourFirstTaskTask(),
    tryTheSearchFieldTask(),
    sortTheTableTask(),
  ]
}

function createYourFirstTaskTask(): TaskItemModel {
  return {
    id: 1,
    title: `Create your first task.`,
    description: `Click the 'add' button on the right bottom corner of the screen, fill up the 'new task' form and save.`,
    dueDate: null,
    isCompleted: false,
  }
}

function tryTheSearchFieldTask(): TaskItemModel {
  return {
    id: 2,
    title: `Try the search field.`,
    description: `Type anything into the search field and see how the rows are filtered using the 'where' method.`,
    dueDate: null,
    isCompleted: false,
  }
}

function sortTheTableTask(): TaskItemModel {
  return {
    id: 3,
    title: `Sort the tasks.`,
    description: `Click on the table's headers to sort the the rows using the 'orderBy' method.`,
    dueDate: null,
    isCompleted: false,
  }
}

export default function App(): JSX.Element {
  const uiStore: UiStore = useMemo(() => STORES.get(UiStore), [])
  const tasksListStore: TaskItemListStore = useMemo(() => STORES.get(TaskItemListStore), [])
  const [isTaskItemFormDialogOpen, setIsTaskFormOpen]: IsTaskFormOpenState = useState<boolean>(false)

  useEffect(() => {
    subscribeToIsTaskFormOpen(uiStore, setIsTaskFormOpen)
    setBaseUrl()
    if (!tasksListStore.value.length) tasksListStore.add(createInitialTasks())
  }, [])

  return <React.StrictMode>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
    {isTaskItemFormDialogOpen && <TaskItemFormDialog></TaskItemFormDialog>}
  </React.StrictMode>
}
