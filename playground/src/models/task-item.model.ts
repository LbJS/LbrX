
export interface TaskItemModel {
  id: number
  title: string
  isCompleted: boolean
  description: string | null
  dueDate: Date | null
}
