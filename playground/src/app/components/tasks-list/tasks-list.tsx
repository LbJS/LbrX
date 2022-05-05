import { isNull, newDate } from 'lbrx/utils'
import React, { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import Table from 'src/generic-components/table/table'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { TaskItemStore } from 'src/stores/task-item.store'
import { TaskItemsListStore } from 'src/stores/task-items-list.store'
import { UiStore } from 'src/stores/ui.store'

type TaskItemsState = [TaskItemModel[], Dispatch<React.SetStateAction<TaskItemModel[]>>]

export default function TasksList(): JSX.Element {
  const uiStore: UiStore = useMemo(() => STORES.get(UiStore), [])
  const taskItemsListStore: TaskItemsListStore = useMemo(() => STORES.get(TaskItemsListStore), [])
  const taskItemStore: TaskItemStore = useMemo(() => STORES.get(TaskItemStore), [])

  const openEditTaskForm = useCallback((task: TaskItemModel) => {
    uiStore.openTaskForm(task)
  }, [])

  const [taskItems, setTaskItems]: TaskItemsState = useState<TaskItemModel[]>(taskItemsListStore.value)

  useEffect(() => {
    const taskItemsSub = taskItemsListStore.toList$().subscribe(setTaskItems)
    return () => taskItemsSub.unsubscribe()
  }, [])

  return <Table tableClasses={[`light-text`, `highlight`]}
    tableHead={
      <React.Fragment>
        <tr>
          <th>Id</th>
          <th>Completed</th>
          <th>Title</th>
          <th>Due Date</th>
          <th>Description</th>
        </tr>
      </React.Fragment>
    }
    tableBody={
      <React.Fragment>
        {taskItems.map(taskItem =>
          <tr key={taskItem.id}
            onClick={() => openEditTaskForm(taskItem)}
            style={{ cursor: `pointer` }}>
            <td>{taskItem.id}</td>
            <td>{taskItem.isCompleted ? `Yes` : `No`}</td>
            <td>{taskItem.title}</td>
            <td>{isNull(taskItem.dueDate) ? `--` : newDate(taskItem.dueDate).toLocaleString(`en-US`, { dateStyle: `medium`, timeStyle: `short` })}</td>
            <td>{taskItem.description}</td>
          </tr>)}
      </React.Fragment>
    }></Table>
}
