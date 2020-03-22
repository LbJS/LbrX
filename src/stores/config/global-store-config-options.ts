import { Storages } from './storages.enum'
import { ObjectCompareTypes } from './object-compare-types.enum'

// tslint:disable: no-redundant-jsdoc
/**
 * Global store configuration options.
 */
export interface GlobalStoreConfigOptions {
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
	customStorage?: Storage | null
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
}
