import { BaseStore } from '../../base-store'

// tslint:disable-next-line: quotemark
export interface InitializableStore<T extends object, S extends object, E = any> extends Pick<BaseStore<T, S, E>, 'initialize' | 'initializeAsync' | 'initializeLazily'> { }
