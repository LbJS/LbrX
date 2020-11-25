import { AdvancedConfigOptions } from './advanced-config-options.interface'
import { ObjectCompareTypes } from './object-compare-types.enum'
import { Storages } from './storages.enum'

export interface BaseStoreConfigOptions {
  /**
   * Configures either the store's state can be reseted to it's initial value.
   * @default
   * isResettable = true
   */
  isResettable?: boolean,
  /**
   * Sets the type of storage to be used for caching.
   * - If cached value would be found at store's initialization, this cached value will be used instead of the initial value.
   * @default
   * type = Storages.none
   */
  storageType?: Storages,
  /**
   * Sets the debounce time (in milliseconds) that will be used before storing the state's value.
   * @default
   * debounceTime = 2000
   */
  storageDebounceTime?: number,
  /**
   * Custom storage-api. Will be used if custom storage type was selected.
   */
  customStorageApi?: Storage | null
  /**
   * Object's change detection strategy.
   * Performance may vary depends on object's size and the wight of the callbacks.
   * See enum options comments for more information.
   * @default
   * objectCompareType = ObjectCompareTypes.advanced
   */
  objectCompareType?: ObjectCompareTypes
  /**
   * Enabling will increases performance.
   * @warning
   * Enable simple cloning only if state's value isn't a class and does not include any instanced properties.
   * May result errors with instanced objects like classes or Dates!
   * @default
   * isSimpleCloning = false
   */
  isSimpleCloning?: boolean
  /**
   * Defines whether or not the store should handle classes. Explanation:
   * - All objects or properties that were an `instanceOf ClassName` at the initial value, will be
   * instantiated to to the same object type.
   * - This will also handle Date and Moment objects.
   * @default
   * isClassHandler = true
   */
  isClassHandler?: boolean
  /**
   * Defines whether or not the store's state in immutable.
   * - Disabling immutability will skip all state's cloning and freezing.
   * - Disabling immutability will increase performance.
   * - Disabling immutability will increase the risk of bugs caused by the nature of JavaScript's mutable objects.
   * @default
   * isImmutable = true
   */
  isImmutable?: boolean
  /**
   * Define a custom serialization function if you need custom logic.
   * Currently it's in use for storing and retrieving data from browser's storage.
   * @default
   * stringify = JSON.stringify
   */
  stringify?: (
    value: any,
    replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
    space?: string | number
  ) => string
  /**
   * Define a custom desexualization function if you need custom logic.
   * Currently it's in use for storing and retrieving data from browser's storage.
   * @default
   * parse = JSON.parse
   */
  parse?: (text: string | null, reviver?: (this: any, key: string, value: any) => any) => any
  /**
   * Advanced configuration.
   */
  advanced?: AdvancedConfigOptions | null
}
