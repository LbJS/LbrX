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

	it('should set the initial value.', () => {
		expect(uiState.value).toMatchObject(createInitialUiState())
	})
})
