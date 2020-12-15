import { BaseStore } from '../../base-store'

// tslint:disable: quotemark
export interface DestroyableStore<T extends object, S extends object, E = any> extends Pick<BaseStore<T, S, E>,
  'reset'
  | 'hardReset'
  | 'destroy'
  > { }
