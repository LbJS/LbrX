import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import TaskItemFormDialog from 'src/app/dialogs/task-item/task-item-form.dialog'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { TaskItemsListStore } from 'src/stores/task-items-list.store'
import { TaskFormState, UiStore } from 'src/stores/ui.store'
import Footer from './components/footer/footer.component'
import Header from './components/header/header.component'
import Main from './components/main/main.component'

type TaskFormStateDispatcher = Dispatch<SetStateAction<TaskFormState>>
type IsTaskFormOpenState = [TaskFormState, TaskFormStateDispatcher]

function subscribeToIsTaskFormOpen(uiStore: UiStore, setTaskForm: TaskFormStateDispatcher): void {
  uiStore.get$(value => value.taskFormState).subscribe(setTaskForm)
}

function setBaseUrl(): void {
  const baseUrl = document.getElementsByTagName(`base`)[0].href
  window.history.replaceState({}, document.title, baseUrl)
}

function createInitialTasks(): TaskItemModel[] {
  return [
    createYourFirstTaskTask(),
    createTryTheSearchFieldTask(),
    createSortTheTableTask(),
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

function createTryTheSearchFieldTask(): TaskItemModel {
  return {
    id: 2,
    title: `Try the search field.`,
    description: `Type anything into the search field and see how the rows are filtered using the 'where' method.`,
    dueDate: null,
    isCompleted: false,
  }
}

function createSortTheTableTask(): TaskItemModel {
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
  const tasksListStore: TaskItemsListStore = useMemo(() => STORES.get(TaskItemsListStore), [])
  const [taskFormState, setTaskForm]: IsTaskFormOpenState = useState<TaskFormState>({
    isTaskFormOpen: false,
    taskPayload: null,
  })

  useEffect(() => {
    subscribeToIsTaskFormOpen(uiStore, setTaskForm)
    setBaseUrl()
    if (!tasksListStore.value.length) tasksListStore.add(createInitialTasks())
  }, [])

  return <React.StrictMode>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
    {taskFormState.isTaskFormOpen && <TaskItemFormDialog task={taskFormState.taskPayload}></TaskItemFormDialog>}
  </React.StrictMode>
}
