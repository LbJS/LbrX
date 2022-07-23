import { compareObjects } from 'lbrx/utils'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { Subscriber, Subscription } from 'rxjs'
import { pairwise } from 'rxjs/operators'
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
type SubscriptionDispatcher = Dispatch<SetStateAction<Subscription | null>>
type YourFirstTaskTaskResolverSubState = [Subscription | null, SubscriptionDispatcher]

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
  const yourFirstTaskTaskResolverSub: Subscription = useMemo(() => new Subscriber(), [])


  const [taskFormState, setTaskForm]: IsTaskFormOpenState = useState<TaskFormState>({
    isTaskFormOpen: false,
    taskPayload: null,
  })

  const unsubscribeFromFirstTaskTaskResolver = useCallback(() => {
    yourFirstTaskTaskResolverSub.unsubscribe()
  }, [])
  const yourFirstTaskTaskResolver = useCallback(([prevTasksCount, currTasksCount]: [number, number]) => {
    if (currTasksCount <= prevTasksCount) return
    const yourFirstTaskTaskModel = createYourFirstTaskTask()
    if (!tasksListStore.has(yourFirstTaskTaskModel.id)) return unsubscribeFromFirstTaskTaskResolver()
    const yourFirstTaskTaskModelFromStore = tasksListStore.get(yourFirstTaskTaskModel.id)
    if (!compareObjects(yourFirstTaskTaskModel, yourFirstTaskTaskModelFromStore)) return unsubscribeFromFirstTaskTaskResolver()
    if (yourFirstTaskTaskModelFromStore.isCompleted) return unsubscribeFromFirstTaskTaskResolver()
    tasksListStore.update(yourFirstTaskTaskModelFromStore.id, { isCompleted: true })
    unsubscribeFromFirstTaskTaskResolver()
  }, [])

  useEffect(() => {
    subscribeToIsTaskFormOpen(uiStore, setTaskForm)
    setBaseUrl()
    if (!tasksListStore.value.length) tasksListStore.add(createInitialTasks())
    const sub = tasksListStore.count$()
      .pipe(pairwise())
      .subscribe(x => yourFirstTaskTaskResolver(x))
    yourFirstTaskTaskResolverSub.add(sub)
  }, [])

  return <React.StrictMode>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
    {taskFormState.isTaskFormOpen && <TaskItemFormDialog task={taskFormState.taskPayload}></TaskItemFormDialog>}
  </React.StrictMode>
}
