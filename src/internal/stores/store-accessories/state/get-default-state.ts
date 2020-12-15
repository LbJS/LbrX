import { State } from './state.interface'

export function getDefaultState<T extends object>(): State<T> {
  return {
    value: null,
    isPaused: false,
    isLoading: false,
    isHardResettings: false,
    error: null,
  }
}
