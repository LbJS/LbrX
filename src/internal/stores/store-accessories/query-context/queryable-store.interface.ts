import { Store } from '../../store'

export interface QueryableStore<T extends object, E = any> extends Pick<Store<T, E>, 'select$' | 'onAction'> { }
