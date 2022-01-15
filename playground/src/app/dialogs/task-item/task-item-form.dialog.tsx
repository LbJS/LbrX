import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Subscriber } from 'rxjs'
import Btn from 'src/generic-components/btn/btn'
import Dialog from 'src/generic-components/dialog/dialog.component'
import { FormField, InputTypes } from 'src/generic-components/form-field/form-field.component'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { getNewTaskItemModel, TaskItemStore } from 'src/stores/task-item.store'
import { TaskItemsListStore } from 'src/stores/task-items-list.store'
import { UiStore } from 'src/stores/ui.store'
import { onChangeHandler } from 'src/utils/on-change-handler'
import './task-item-form.dialog.scss'

export interface TaskItemFormDialogOptions {
  task?: TaskItemModel
}

type TaskItemDispatcher = Dispatch<SetStateAction<TaskItemModel>>
type HtmlElementDispatch = [HTMLElement | null, Dispatch<SetStateAction<HTMLElement | null>>]
type TaskItemModelState = [TaskItemModel, TaskItemDispatcher]
type ForceUpdateState = [number, Dispatch<React.SetStateAction<number>>]
type TimeState = [string, React.Dispatch<TimeAction>]

interface TimeAction {
  payload: Date | null
}

async function initItemStore(taskItemStore: TaskItemStore, taskItem: TaskItemModel): Promise<void> {
  if (taskItemStore.isInitialized && taskItem.id !== taskItemStore.value.id) {
    await taskItemStore.hardReset()
    taskItemStore.initialize(taskItem)
  } else if (!taskItemStore.isInitialized) {
    taskItemStore.initialize(taskItem)
  }
}

function setTimeReducer(_: string, action: TimeAction): string {
  const date = action.payload
  return date ? date.toLocaleTimeString([], { hour12: true, timeStyle: `short` }) : ``
}

export default function TaskItemFormDialog({ task }: TaskItemFormDialogOptions): JSX.Element {
  const sub = useMemo(() => new Subscriber(), [])
  const uiStore: UiStore = useMemo(() => STORES.get(UiStore), [])
  const taskItemStore: TaskItemStore = useMemo(() => STORES.get(TaskItemStore), [])
  const taskItemsListStore: TaskItemsListStore = useMemo(() => STORES.get(TaskItemsListStore), [])
  const taskFormDialogOptions: Partial<M.ModalOptions> = useMemo(() => ({
    onCloseEnd: () => modalCloseCb()
  }), [])

  const modalRef = useRef<M.Modal>()
  const datepickerRef = useRef<M.Datepicker>()
  const timepickerRef = useRef<M.Timepicker>()

  const [_, forceUpdate]: ForceUpdateState = useState(0)
  const [taskItem, setTaskItem]: TaskItemModelState = useState<TaskItemModel>(task || getNewTaskItemModel())
  const [datepickerElem, setDatepickerElem]: HtmlElementDispatch = useState<HTMLElement | null>(null)
  const [timepickerElem, setTimepickerElem]: HtmlElementDispatch = useState<HTMLElement | null>(null)

  const [time, dispatchTime]: TimeState = useReducer(setTimeReducer, ``)

  const subscribeToTaskItem = useCallback(() => sub.add(taskItemStore.get$().subscribe(setTaskItem)), [])
  const componentCleanUp = useCallback(() => { sub.unsubscribe() }, [])
  const modalCloseCb = useCallback(() => uiStore.closeTaskForm(`close-task-form`), [])
  const closeForm = useCallback(() => modalRef.current?.close(), [])
  const clearForm = useCallback(() => taskItemStore.set(getNewTaskItemModel()), [])
  const saveTask = useCallback(() => {
    if (!taskItem.id) {
      const currMaxId = taskItemsListStore.select(x => x.id).orderBy(/*desc*/true).firstOrDefault()
      taskItem.id = currMaxId ? currMaxId + 1 : 1
    }
    taskItemsListStore.addOrUpdate(taskItem)
  }, [taskItem])

  useEffect(() => {
    initItemStore(taskItemStore, taskItem).then(subscribeToTaskItem)
    return componentCleanUp
  }, [])

  useEffect(() => {
    if (!datepickerRef.current || !taskItemStore.isInitialized) return
    sub.add(taskItemStore.get$(x => x.dueDate).subscribe(dueDate => {
      datepickerRef.current?.setDate(dueDate || undefined)
      datepickerRef.current?.setInputValue()
    }))
  }, [datepickerRef.current, taskItemStore.isInitialized])

  useEffect(() => {
    if (!timepickerRef.current || !taskItemStore.isInitialized) return
    sub.add(taskItemStore
      .get$(x => x.dueDate)
      .subscribe(dueDate => dispatchTime({ payload: dueDate })))
  }, [timepickerRef.current, taskItemStore.isInitialized])

  return <Dialog modalOptions={taskFormDialogOptions}
    modalClasses={[`task-item-form-dialog`]}
    header={taskItem.id ? `Task ${taskItem.id}` : `New Task`}
    headerClasses={[`cyan`, `darken-1`]}
    content={<React.Fragment>
      <div style={{ display: `flex` }}>
        <FormField styles={{ flex: `1` }}>
          <React.Fragment>
            <input type="text"
              id="title"
              value={taskItem.title}
              onChange={onChangeHandler(taskItemStore.setTitle)} />
            <label htmlFor="title">Title</label>
          </React.Fragment>
        </FormField>
        <FormField>
          <p style={{ marginLeft: `1rem` }}>
            <label>
              <input type="checkbox"
                className="filled-in"
                checked={taskItem.isCompleted}
                onChange={onChangeHandler(taskItemStore.setIsCompleted)} />
              <span>Completed</span>
            </label>
          </p>
        </FormField>
      </div>
      <div style={{ display: `flex`, alignItems: `flex-start` }}>
        <FormField styles={{ flex: `1` }}
          inputType={InputTypes.date}
          inputElement={datepickerElem}
          ref={datepickerRef}
          forceUpdateState={forceUpdate}
          updateLabels$={taskItemStore.get$(x => x.dueDate)}
          datepickerOptions={{
            onSelect: taskItemStore.setDueDate,
          }}>
          <React.Fragment>
            <input type="text"
              id="dueDate"
              ref={setDatepickerElem} />
            <label htmlFor="dueDate">Due date</label>
          </React.Fragment>
        </FormField>
        <FormField styles={{ flex: `1` }}
          inputType={InputTypes.time}
          inputElement={timepickerElem}
          ref={timepickerRef}
          forceUpdateState={forceUpdate}
          updateLabels$={taskItemStore.get$(x => x.dueDate)}
          timepickerOptions={{
            onSelect: (h, m) => taskItemStore.setDueDate(taskItemStore.value.dueDate, h, m)
          }}>
          <React.Fragment>
            <input type="text"
              id="dueTime"
              value={time}
              ref={setTimepickerElem}
              readOnly />
            <label htmlFor="dueTime">Due time</label>
          </React.Fragment>
        </FormField>
        <div style={{ borderBottom: `1px solid #9e9e9e`, marginTop: `4px` }}>
          <Btn icon="close"
            action={() => { taskItemStore.setDueDate(null) }}
            classList={[`modal-header-close-btn`, `btn-floating`, `btn-large`, `btn-flat`]}
            styles={{ paddingTop: `2px` }}></Btn>
        </div>
      </div>
      <FormField>
        <React.Fragment>
          <textarea id="description"
            className="materialize-textarea"
            value={taskItem.description || ``}
            onChange={onChangeHandler(taskItemStore.setDescription)}></textarea>
          <label htmlFor="description">Description</label>
        </React.Fragment>
      </FormField>
    </React.Fragment>}
    footer={<React.Fragment>
      <Btn action={clearForm}
        classList={[`btn-flat`, `cyan-font`]}>Clear</Btn>
      <Btn action={saveTask}
        classList={[`cyan`, `darken-1`]}>Save</Btn>
      <Btn action={[saveTask, closeForm]}
        classList={[`cyan`, `darken-1`]}>Save & Close</Btn>
    </React.Fragment>}
    footerClasses={[`btns-container-pull-right`]}
    modalRef={modalRef}></Dialog>
}
