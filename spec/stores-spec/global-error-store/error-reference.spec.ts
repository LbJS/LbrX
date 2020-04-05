import { GlobalErrorStore } from 'lbrx'
import { createError, createCustomError, CustomError } from 'test-subjects'

describe('Global Error Store - Error Reference:', () => {

	let globalErrorStore: GlobalErrorStore<Error>

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		globalErrorStore = providerModule.GlobalErrorStore.getStore()
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should have different error object reference.', () => {
		const error = createError()
		globalErrorStore.setError(error)
		expect(globalErrorStore.getError()).not.toBe(error)
	})

	it("should not be effected by error object's change after set.", () => {
		const errMsg = 'New Error Msg'
		const error = createError()
		globalErrorStore.setError(error)
		error.message = errMsg
		expect(globalErrorStore.getError()?.message).toBeTruthy()
		expect(globalErrorStore.getError()?.message).not.toBe(errMsg)
	})

	it("should not be effected by returned error object's change.", () => {
		const errMsg = 'New Error Msg'
		let error: Error | null = createError()
		globalErrorStore.setError(error)
		error = globalErrorStore.getError()
		if (error) {
			error.message = errMsg
		} else {
			fail('Invalid returned value.')
		}
		expect(globalErrorStore.getError()?.message).toBeTruthy()
		expect(globalErrorStore.getError()?.message).not.toBe(errMsg)
	})

	it('should have different nested custom error object reference.', () => {
		const error = createCustomError()
		globalErrorStore.setError(error)
		expect(error.innerError?.innerError).toBeTruthy()
		expect((globalErrorStore.getError() as CustomError).innerError?.innerError).toBeTruthy()
		expect((globalErrorStore.getError() as CustomError).innerError?.innerError).not.toBe(error.innerError?.innerError)
	})

	it("should not be effected by custom error object's change after set.", () => {
		const errMsg = 'New Error Msg'
		const error = createCustomError()
		globalErrorStore.setError(error)
		if (error.innerError?.innerError) {
			error.innerError.innerError.message = errMsg
		} else {
			fail('Invalid test subject')
		}
		expect((globalErrorStore.getError() as CustomError).innerError?.innerError).toBeTruthy()
		expect((globalErrorStore.getError() as CustomError).innerError?.innerError).not.toBe(errMsg)
	})
})
