import { Storage } from './generic-storage.mock'

export function mockLocalStorage(): void {
	const localStorage = new Storage();
	(window as any).localStorage = localStorage
	globalThis.localStorage = localStorage as any
}

export function deleteLocalStorageMock(): void {
	delete (window as any).localStorage
	delete globalThis.localStorage
}
