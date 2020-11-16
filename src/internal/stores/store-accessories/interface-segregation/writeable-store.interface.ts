import { Store } from '../../store'

// tslint:disable-next-line: quotemark
export interface WriteableStore<T extends object, E = any> extends Pick<Store<T, E>, 'override' | 'update'> { }
