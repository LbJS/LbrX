import { UiStateStore } from 'test-subjects'
import { GlobalErrorStore } from 'lbrx'
import { filter } from 'rxjs/operators'

describe('Global Error Store:', () => {

	let globalErrorStore: GlobalErrorStore<string>


	beforeEach(async () => {
		const provider = (await import('provider')).default
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

	it('should return the error message after setting a new error.', () => {
		const errorMsg = 'Some Error.'
		globalErrorStore.setGlobalError(errorMsg)
		expect(globalErrorStore.getGlobalError()).toBe(errorMsg)
	})

	it('should return the error message from observable after setting a new error.', done => {
		const errorMsg = 'Some Error.'
		globalErrorStore.globalError$
			.pipe(filter(x => !!x))
			.subscribe(value => {
				expect(value).toBe(errorMsg)
				done()
			})
		globalErrorStore.setGlobalError(errorMsg)
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
		globalErrorStore.globalError$.subscribe(value => {
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
				globalErrorStore.setGlobalError(value)
			}, i * 10)
		})
	}, 500)
})
