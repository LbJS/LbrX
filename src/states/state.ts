import { StateTags } from './state-tags.enum'

export interface State<T extends object, E = any> {
  value: T
  isPaused: boolean
  isLoading: boolean
  isHardResettings: boolean
  error: E
  tag: StateTags
}
