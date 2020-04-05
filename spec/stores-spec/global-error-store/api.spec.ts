import { GlobalErrorStore } from 'lbrx'
import { filter, skip } from 'rxjs/operators'
import { timer } from 'rxjs'
import { createError, createCustomError } from 'test-subjects'

describe('Global Error Store API:', () => {

	let globalErrorStore: GlobalErrorStore<string | Error>

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		globalErrorStore = providerModule.GlobalErrorStore.getStore()
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should have null as the default error value', () => {
		expect(globalErrorStore.getError()).toBeNull()
	})

	it('should return that no error exist by default.', () => {
		expect(globalErrorStore.isError()).toBeFalsy()
	})

	it('should return that an error exist after setting a new error.', () => {
		const errorMsg = 'Some Error.'
		globalErrorStore.setError(errorMsg)
		expect(globalErrorStore.isError()).toBeTruthy()
	})

	it('should return the error message after setting a new error.', () => {
		const errorMsg = 'Some Error.'
		globalErrorStore.setError(errorMsg)
		expect(globalErrorStore.getError()).toBe(errorMsg)
	})

	it('should return the error message from observable after setting a new error.', done => {
		const errorMsg = 'Some Error.'
		globalErrorStore.error$
			.pipe(filter(x => !!x))
			.subscribe(value => {
				expect(value).toBe(errorMsg)
				done()
			})
		globalErrorStore.setError(errorMsg)
	}, 100)

	it('should return the errors data flow from observable.', done => {
		const errorsList = [
			'First Error',
			'Second Error',
			null,
			'Third Error',
		]
		let valueIndex = 0
		globalErrorStore.error$.pipe(
			skip(1),
		).subscribe(value => {
			expect(value).toBe(errorsList[valueIndex++])
			if (valueIndex == errorsList.length) done()
		})
		errorsList.forEach((value, i) => {
			setTimeout(() => {
				globalErrorStore.setError(value)
			}, i * 10)
		})
	}, 500)

	it('should not emit null value more then once.', async () => {
		let nullCounter = 0
		globalErrorStore.error$.subscribe(value => {
			if (value === null) nullCounter++
		})
		globalErrorStore.setError(null)
		globalErrorStore.setError(null)
		globalErrorStore.setError(null)
		await timer(100).toPromise()
		expect(nullCounter).toBe(1)
	}, 200)

	it('should be the exact same error object.', () => {
		globalErrorStore.setError(createError())
		expect(globalErrorStore.getError()).toMatchObject(createError())
	})

	it('should be the exact same nested custom error object.', () => {
		globalErrorStore.setError(createCustomError())
		expect(globalErrorStore.getError()).toMatchObject(createCustomError())
	})
})
