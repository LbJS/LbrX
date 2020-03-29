import { UiStateStore } from 'test-subjects'

describe('Store Is Loading State', () => {

	let uiStore: UiStateStore

	beforeEach(async () => {
		const provider = (await import('provider')).default
		uiStore = provider.provide(UiStateStore.name)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it("should have false as the default store's loading state.", () => {
		expect(uiStore.isLoading).toBeFalsy()
	})

	it("should have false as the default store's loading state from observable.", done => {
		uiStore.isLoading$.subscribe(value => {
			expect(value).toBeFalsy()
			done()
		})
	})

	it('should have distinct observable values.', done => {
		const expectedValues = [false, true, false]
		const nextValues = [false, true, true, false, false]
		const actualValues: boolean[] = []
		uiStore.isLoading$.subscribe(value => actualValues.push(value))
		nextValues.forEach((value, i) => {
			setTimeout(() => {
				uiStore.isLoading = value
				if (i + 1 == nextValues.length) {
					expect(expectedValues).toMatchObject(actualValues)
					done()
				}
			}, i * 10)
		})
	}, 500)
})
