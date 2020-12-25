import { Actions } from '../../actions'
import { State } from '../../state'

export type SetStateParam<T extends object, E = any> = {
  valueFnOrState: ((stateValue: Readonly<T>) => T) | Partial<State<T, E>>,
  actionName: string | Actions,
  stateExtension?: Partial<Omit<State<T, E>, 'value'>>,
  doSkipClone?: boolean,
  doSkipFreeze?: boolean,
}
