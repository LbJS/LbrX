import { BaseStore } from '../../base-store'

// tslint:disable-next-line: quotemark
export interface WriteableStore<T extends object, E = any> extends Pick<BaseStore<T, E>, 'override' | 'update' | 'setInstancedValue'> { }
