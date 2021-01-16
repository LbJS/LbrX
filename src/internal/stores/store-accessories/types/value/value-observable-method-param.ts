import { MonoTypeOperatorFunction } from 'rxjs'
import { Actions } from '../../actions'
import { Compare } from '../method'
import { ProjectsOrKeys } from './project-or-keys'

export type ValueObservableMethodParam<T extends object, R> = {
  onActionOrActions?: Actions | string | (Actions | string)[] | null,
  projectsOrKeys?: ProjectsOrKeys<T, R> | null,
  compare?: Compare | null,
  operators?: MonoTypeOperatorFunction<R>[] | null,
}
