import { BaseStore } from '../../base-store'

// tslint:disable: quotemark
export interface DestroyableStore<T extends object, E = any> extends Pick<BaseStore<T, E>,
  'reset'
  | 'hardReset'
  | 'disposeQueryContext'
  | 'destroy'
  > { }
