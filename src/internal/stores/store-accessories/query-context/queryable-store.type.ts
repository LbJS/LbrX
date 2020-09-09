import { Store } from '../../store'

export type QueryableStore<T extends object, E = any> = Pick<Store<T, E>, 'select$' | 'onAction'>
