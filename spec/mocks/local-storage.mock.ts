import { GenericStorage } from './generic-storage.mock'

export function mockLocalStorage(): void {
	globalThis.localStorage = new GenericStorage()
}

export function deleteLocalStorageMock(): void {
	delete globalThis.localStorage
}
