import { UiStateStore, createError } from 'test-subjects'
import { timer } from 'rxjs'
import { skip } from 'rxjs/operators'

describe('Store Error API:', () => {

	let uiStore: UiStateStore

	beforeEach(async () => {
		const provider = (await import('provider.module')).default
		uiStore = provider.provide(UiStateStore)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should have null as the default error value.', () => {
		expect(uiStore.getError()).toBeNull()
	})

	it('should return null as the default error value from observable.', done => {
		uiStore.error$.subscribe(value => {
			expect(value).toBeNull()
			done()
		})
	})

	it('should return the exact same error after setting it.', () => {
		uiStore.setError(createError())
		expect(uiStore.getError()).toMatchObject(createError())
	})

	it('should return the exact same error from observable after setting it.', done => {
		uiStore.setError(createError())
		uiStore.error$.subscribe(value => {
			expect(value).toMatchObject(createError())
			done()
		})
	})

	it('should not emit null value more then once.', async () => {
		let nullCounter = 0
		uiStore.error$.subscribe(value => {
			if (value === null) nullCounter++
		})
		uiStore.setError(null)
		uiStore.setError(null)
		uiStore.setError(null)
		await timer(100).toPromise()
		expect(nullCounter).toBe(1)
	}, 200)

	it('should return the errors data flow from observable.', done => {
		const errorsList = [
			createError(),
			null,
			createError(),
		]
		let valueIndex = 0
		uiStore.error$.pipe(
			skip(1),
		).subscribe(value => {
			const errorItem = errorsList[valueIndex++]
			if (errorItem) {
				expect(value).toMatchObject(errorItem)
			} else {
				expect(value).toBe(errorItem)
			}
			if (valueIndex == errorsList.length) done()
		})
		errorsList.forEach((value, i) => {
			setTimeout(() => {
				uiStore.setError(value)
			}, i * 10)
		})
	}, 500)
})
