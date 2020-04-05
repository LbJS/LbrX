import { GlobalErrorStore } from 'lbrx'
import { NullStateStore, createCustomError } from 'test-subjects'

describe('Store Error - Global Error Update', () => {

	let globalErrorStore: GlobalErrorStore<Error>
	let nullStore: NullStateStore

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		const provider = providerModule.default
		globalErrorStore = providerModule.GlobalErrorStore.getStore()
		nullStore = provider.provide(NullStateStore)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should update global error store.', () => {
		nullStore.setError(createCustomError())
		expect(globalErrorStore.getError()).toMatchObject(createCustomError())
	})

	it('should not update global error store with null.', () => {
		nullStore.setError(createCustomError())
		nullStore.setError(null)
		expect(globalErrorStore.getError()).toMatchObject(createCustomError())
	})
})
