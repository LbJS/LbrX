import { BaseStore } from '../../base-store'

// tslint:disable-next-line: quotemark
export interface InitializableStore<T extends object, E = any> extends Pick<BaseStore<T, E>, 'initialize' | 'initializeAsync' | 'initializeLazily'> { }
