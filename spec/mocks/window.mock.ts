import { Window_Type } from 'types'

export function mockWindow(): Window_Type {
	globalThis.window = {} as Window_Type
	return globalThis.window
}

export function deleteMockedWindow(): void {
	delete globalThis.window
}
