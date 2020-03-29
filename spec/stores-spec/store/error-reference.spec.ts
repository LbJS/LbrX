import { UiStateStore, createError, NullStateStore, createCustomError } from 'test-subjects'

describe('Store Error Reference:', () => {

	let uiStore: UiStateStore
	let nullStore: NullStateStore

	beforeEach(async () => {
		const provider = (await import('provider')).default
		uiStore = provider.provide(UiStateStore.name)
		nullStore = provider.provide(NullStateStore.name)
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

	it('should return the error with different reference for the inner error after setting it.', () => {
		const error = createCustomError()
		nullStore.setError(error)
		if (!error.innerError?.innerError) fail('Invalid test subject.')
		expect(nullStore.getError()?.innerError?.innerError).toBeTruthy()
		expect(nullStore.getError()?.innerError?.innerError).not.toBe(error.innerError?.innerError)
	})

	it("should not be effected by error object's change after set.", () => {
		const errMsg = 'New Error Msg'
		const error = createError()
		uiStore.setError(error)
		error.message = errMsg
		expect(uiStore.getError()?.message).toBeTruthy()
		expect(uiStore.getError()?.message).not.toBe(errMsg)
	})

	it("should not be effected by returned error object's change.", () => {
		const errMsg = 'New Error Msg'
		let error: Error | null = createError()
		uiStore.setError(error)
		error = uiStore.getError()
		if (error) {
			error.message = errMsg
		} else {
			fail('Invalid returned value.')
		}
		expect(uiStore.getError()?.message).toBeTruthy()
		expect(uiStore.getError()?.message).not.toBe(errMsg)
	})

	it('should have different nested custom error object reference.', () => {
		const error = createCustomError()
		nullStore.setError(error)
		expect(error.innerError?.innerError).toBeTruthy()
		expect(nullStore.getError()?.innerError?.innerError).toBeTruthy()
		expect(nullStore.getError()?.innerError?.innerError).not.toBe(error.innerError?.innerError)
	})

	it("should not be effected by custom error object's change after set.", () => {
		const errMsg = 'New Error Msg'
		const error = createCustomError()
		nullStore.setError(error)
		if (error.innerError?.innerError) {
			error.innerError.innerError.message = errMsg
		} else {
			fail('Invalid test subject')
		}
		expect(nullStore.getError()?.innerError?.innerError).toBeTruthy()
		expect(nullStore.getError()?.innerError?.innerError).not.toBe(errMsg)
	})
})
