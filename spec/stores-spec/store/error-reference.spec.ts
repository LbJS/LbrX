import { UiStateStore, createError } from 'test-subjects'

describe('Store Error, Error Reference:', () => {

	let uiStore: UiStateStore

	beforeEach(async () => {
		const provider = (await import('provider')).default
		uiStore = provider.provide(UiStateStore.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should return the error with different reference after setting it.', () => {
		const error = createError()
		uiStore.setError(error)
		expect(uiStore.getError()).toBeTruthy()
		expect(uiStore.getError()).not.toBe(error)
	})
})
