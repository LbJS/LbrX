import { Storages } from "./storages.enum";

export interface StoreConfigOptions {
	storeName: string,
	isResettable?: boolean,
	storage?: Storages,
	storageDelay?: number,
	doObjectCompare?: boolean,
}
