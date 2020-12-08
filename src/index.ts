import { LbrXManager } from './core'
import { DevtoolsOptions } from './dev-tools'

/**
 * @deprecated Import from dev-tools module directly.
 */
// tslint:disable-next-line: no-empty-interface
interface DevtoolsOptionsTemp extends DevtoolsOptions { }
/**
 * @deprecated Import from core module directly.
 */
const lbrXManager = LbrXManager

export { BaseStore, ListStore, Store } from './internal/stores'
export {
  AdvancedConfigOptions,
  GlobalStoreConfigOptions,
  ListStoreConfig,
  ListStoreConfigCompleteInfo,
  ListStoreConfigOptions,
  ObjectCompareTypes,
  Storages,
  StoreConfig,
  StoreConfigCompleteInfo,
  StoreConfigOptions
} from './internal/stores/config'
export { Actions, State, StoreTags } from './internal/stores/store-accessories'
export { DevtoolsOptionsTemp as DevtoolsOptions }
export { lbrXManager as LbrXManager }

