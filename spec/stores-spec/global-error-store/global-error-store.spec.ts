import { UiStateService } from 'test-subjects'
import { GlobalErrorStore } from 'lbrx'

describe('Global Error Store:', () => {

	let uiService: UiStateService
	let globalErrorStore: GlobalErrorStore<string>


	beforeEach(async () => {
		const provider = (await import('provider')).default
		uiService = provider.provide(UiStateService.name)
		globalErrorStore = provider.provide<typeof GlobalErrorStore>(GlobalErrorStore.name).getStore()
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should have null as the default error value', () => {
		expect(globalErrorStore.getGlobalError()).toBeNull()
	})

	it('should return that no error exist by default.', () => {
		expect(globalErrorStore.isGlobalError()).toBeFalsy()
	})

	it('should return that an error exist after setting a new error.', () => {
		const errorMsg = 'Some Error.'
		globalErrorStore.setGlobalError(errorMsg)
		expect(globalErrorStore.isGlobalError()).toBeTruthy()
	})
})
