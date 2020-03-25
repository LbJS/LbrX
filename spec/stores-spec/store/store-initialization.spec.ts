import { UiStateService, createInitialUiState } from 'test-subjects'

describe('Store initialization: ', () => {

	let uiState: UiStateService

	beforeEach(async () => {
		const testSubjects = await import('test-subjects')
		uiState = testSubjects.Provider.uiStateService
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set the initial value as the first state.', () => {
		expect(uiState.value).toStrictEqual(createInitialUiState())
	})

	it("should set the initial value to store's initial value.", () => {
		expect(uiState.value).toStrictEqual(uiState.store.initialValue)
	})

	it('should return the initial state from observable.', done => {
		uiState.state$.subscribe(value => {
			expect(value).toStrictEqual(createInitialUiState())
			done()
		})
	})
})
