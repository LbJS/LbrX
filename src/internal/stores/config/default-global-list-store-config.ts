import { mergeObjects } from '../../helpers'
import { getDefaultGlobalStoreConfig } from './default-global-store-config'
import { GlobalListStoreConfigOptions } from './global-list-store-config-options.interface'

export function getDefaultGlobalListStoreConfig(): Required<GlobalListStoreConfigOptions> {
  return mergeObjects(getDefaultGlobalStoreConfig(), { id: `id` } as any) as Required<GlobalListStoreConfigOptions>
}
