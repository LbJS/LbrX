import { isNull, newDate } from 'lbrx/utils'
import React, { Dispatch, useEffect, useMemo, useState } from 'react'
import Table from 'src/generic-components/table/table'
import { TaskItemModel } from 'src/models/task-item.model'
import { STORES } from 'src/services/stores.service'
import { TaskItemsListStore } from 'src/stores/task-items-list.store'

type TaskItemsState = [TaskItemModel[], Dispatch<React.SetStateAction<TaskItemModel[]>>]

export default function TasksList(): JSX.Element {
  const taskItemsListStore: TaskItemsListStore = useMemo(() => STORES.get(TaskItemsListStore), [])

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
            onClick={() => { }}>
            <td>{taskItem.id}</td>
            <td>{taskItem.isCompleted ? `Yes` : `No`}</td>
            <td>{taskItem.title}</td>
            <td>{isNull(taskItem.dueDate) ? `--` : newDate(taskItem.dueDate).toLocaleString()}</td>
            <td>{taskItem.description}</td>
          </tr>)}
      </React.Fragment>
    }></Table>
}
