import { GenericStorage } from './generic-storage.mock'

export function mockSessionStorage(): void {
  globalThis.sessionStorage = new GenericStorage()
}

export function deleteSessionStorageMock(): void {
  delete globalThis.sessionStorage
}
