import { Storage } from './generic-storage.mock'

export function mockSessionStorage(): void {
	const sessionStorage = new Storage();
	(window as any).sessionStorage = sessionStorage
	globalThis.sessionStorage = sessionStorage as any
}

export function deleteSessionStorageMock(): void {
	delete (window as any).sessionStorage
	delete globalThis.sessionStorage
}
