
export interface ReduxDevToolsMessage {
  type: string
  state: string | null | undefined
  payload: {
    type: string
    status: boolean
    actionId: number
  }
}
