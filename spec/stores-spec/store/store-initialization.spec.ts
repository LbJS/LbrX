import { UiStateService, createInitialUiState } from 'test-subjects'

describe('Store initialization: ', () => {

	let uiService: UiStateService

	beforeEach(async () => {
		const provider = (await import('provider')).default
		uiService = provider.provide(UiStateService.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set the initial value as the first state.', () => {
		expect(uiService.value).toStrictEqual(createInitialUiState())
	})

	it("should set the initial value to store's initial value.", () => {
		expect(uiService.value).toStrictEqual(uiService.store.initialValue)
	})

	it('should return the initial state from observable.', done => {
		uiService.state$.subscribe(value => {
			expect(value).toStrictEqual(createInitialUiState())
			done()
		})
	}, 100)
})
