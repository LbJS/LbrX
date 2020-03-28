import { GlobalErrorStore } from 'lbrx'
import { createError, createCustomError, CustomError } from 'test-subjects'

describe('Global Error Store, Error Object:', () => {

	let globalErrorStore: GlobalErrorStore<Error>

	beforeEach(async () => {
		const provider = (await import('provider')).default
		globalErrorStore = provider.provide<typeof GlobalErrorStore>(GlobalErrorStore.name).getStore()
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should be the exact same error object.', () => {
		globalErrorStore.setError(createError())
		expect(globalErrorStore.getError()).toMatchObject(createError())
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
		expect(globalErrorStore.getError()?.message).not.toBe(errMsg)
	})

	it('should be the exact same nested custom error object.', () => {
		globalErrorStore.setError(createCustomError())
		expect(globalErrorStore.getError()).toMatchObject(createCustomError())
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
