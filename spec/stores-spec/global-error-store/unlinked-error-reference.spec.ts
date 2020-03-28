import { GlobalErrorStore } from 'lbrx'
import { createError } from 'test-subjects'

describe('Global Error Store, Error Object:', () => {

	let globalErrorStore: GlobalErrorStore<Error>

	beforeEach(async () => {
		const provider = (await import('provider')).default
		globalErrorStore = provider.provide<typeof GlobalErrorStore>(GlobalErrorStore.name).getStore()
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should be the exact same object.', () => {
		globalErrorStore.setError(createError())
		expect(globalErrorStore.getError()).toMatchObject(createError())
	})
})
