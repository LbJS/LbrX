
export interface State<T extends object, E = any> {
  value: Readonly<T> | null
  isPaused: boolean
  isLoading: boolean
  isHardResettings: boolean
  error: E | null
}
