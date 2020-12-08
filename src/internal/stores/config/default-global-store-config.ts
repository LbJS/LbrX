import { parse, stringify } from '../../helpers'
import { GlobalStoreConfigOptions } from './global-store-config-options.interface'
import { ObjectCompareTypes } from './object-compare-types.enum'
import { Storages } from './storages.enum'

// TODO: default for list store

export function getDefaultGlobalStoreConfig(): Required<GlobalStoreConfigOptions> {
  return {
    isResettable: true,
    storageType: Storages.none,
    storageDebounceTime: 2000,
    customStorageApi: null,
    objectCompareType: ObjectCompareTypes.advanced,
    isSimpleCloning: false,
    isClassHandler: true,
    isImmutable: true,
    stringify,
    parse,
    advanced: null,
  }
}
