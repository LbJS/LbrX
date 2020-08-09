import { parse, stringify } from '../../utils'
import { GlobalStoreConfigOptions } from './global-store-config-options.interface'
import { ObjectCompareTypes } from './object-compare-types.enum'
import { Storages } from './storages.enum'

export function getDefaultStoreConfig(): Required<GlobalStoreConfigOptions> {
  return {
    isResettable: true,
    storageType: Storages.none,
    storageDebounceTime: 2000,
    customStorageApi: null,
    objectCompareType: ObjectCompareTypes.advanced,
    isSimpleCloning: false,
    stringify,
    parse,
  }
}
