import { MonoTypeOperatorFunction } from 'rxjs'
import { Actions } from '../../actions'
import { Compare, Pipe } from '../method'
import { ProjectsOrKeys } from './project-or-keys'

export type GetObservableParam<T extends object, R> = {
  pipe?: Pipe<T, R> | null,
  actionOrActions?: Actions | string | (Actions | string)[] | null,
  projectsOrKeys?: ProjectsOrKeys<T, R> | null,
  compare?: Compare | null,
  operators?: MonoTypeOperatorFunction<T | R>[]
}
