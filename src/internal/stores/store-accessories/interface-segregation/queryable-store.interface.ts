import { Store } from '../../store'

// tslint:disable-next-line: quotemark
export interface QueryableStore<T extends object, E = any> extends Pick<Store<T, E>, 'get' | 'get$' | 'when'> { }
