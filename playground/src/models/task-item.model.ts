
export interface TaskItemModel {
  id: number
  name: string
  isCompleted: boolean
  description: string | null
  dueDate: Date | null
}
