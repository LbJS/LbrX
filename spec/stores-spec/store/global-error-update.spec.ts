import { GlobalErrorStore } from 'lbrx'
import { NullStateStore, createCustomError } from 'test-subjects'

describe('Store Error - Global Error Update', () => {

	let globalErrorStore: GlobalErrorStore<Error>
	let nullStore: NullStateStore

	beforeEach(async () => {
		const provider = (await import('provider')).default
		globalErrorStore = provider.provide<typeof GlobalErrorStore>(GlobalErrorStore.name).getStore()
		nullStore = provider.provide(NullStateStore.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should update global error store.', () => {
		nullStore.setError(createCustomError())
		expect(globalErrorStore.getError()).toMatchObject(createCustomError())
	})

	it('should not update global error store will null.', () => {
		nullStore.setError(createCustomError())
		nullStore.setError(null)
		expect(globalErrorStore.getError()).toMatchObject(createCustomError())
	})
})
