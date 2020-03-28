import { GlobalErrorStore } from 'lbrx'
import { filter } from 'rxjs/operators'
import { timer } from 'rxjs'

describe('Global Error Store API:', () => {

	let globalErrorStore: GlobalErrorStore<string>

	beforeEach(async () => {
		const provider = (await import('provider')).default
		globalErrorStore = provider.provide<typeof GlobalErrorStore>(GlobalErrorStore.name).getStore()
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

	it('should return the errors data flow.', done => {
		const errorsList = [
			'First Error',
			'Second Error',
			null,
			'Third Error',
		]
		let valueIndex = 0
		let isFirstCheck = true
		globalErrorStore.error$.subscribe(value => {
			if (isFirstCheck) {
				expect(value).toBeNull()
				isFirstCheck = false
			} else {
				expect(value).toBe(errorsList[valueIndex++])
				if (valueIndex == errorsList.length) done()
			}
		})
		errorsList.forEach((value, i) => {
			setTimeout(() => {
				globalErrorStore.setError(value)
			}, i * 10)
		})
	}, 500)

	it('null value should not be emitted more then once.', async () => {
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
})
