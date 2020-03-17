import { Storages } from './storages.enum'

export interface StoreConfigOptions {
	name: string,
	isResettable?: boolean,
	storage?: {
		type: Storages,
		debounceTime?: number
	},
	doObjectCompare?: boolean,
}
