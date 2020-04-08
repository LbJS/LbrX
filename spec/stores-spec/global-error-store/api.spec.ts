import { GlobalErrorStore } from 'lbrx'
import { skip } from 'rxjs/operators'
import { createCustomError, createError } from 'test-subjects'

describe('Global Error Store API:', () => {

  const errorMsg = 'Some Error.'
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
    globalErrorStore.setError(errorMsg)
    expect(globalErrorStore.isError()).toBeTruthy()
  })

  it('should return the error message after setting a new error.', () => {
    globalErrorStore.setError(errorMsg)
    expect(globalErrorStore.getError()).toBe(errorMsg)
  })

  it('should return the error message from observable after setting a new error.', done => {
    globalErrorStore.error$.pipe(skip(1))
      .subscribe(value => {
        expect(value).toBe(errorMsg)
        done()
      })
    globalErrorStore.setError(errorMsg)
  }, 100)

  it('should return the errors data flow from observable.', () => {
    const errorsStream = ['First Error', 'Second Error', null, 'Third Error', new Error('Some data')]
    const expectedErrorsStream = [null, 'First Error', 'Second Error', null, 'Third Error', new Error('Some data')]
    const actualErrorsStream: (string | null | Error)[] = []
    globalErrorStore.error$.subscribe(value => {
      actualErrorsStream.push(value)
    })
    errorsStream.forEach(value => globalErrorStore.setError(value))
    expect(actualErrorsStream).toStrictEqual(expectedErrorsStream)
  })

  it('should not emit null value more then once.', async () => {
    let nullCounter = 0
    globalErrorStore.error$.subscribe(value => {
      if (value === null) nullCounter++
    })
    globalErrorStore.setError(null)
    globalErrorStore.setError(null)
    globalErrorStore.setError(null)
    await Promise.resolve()
    expect(nullCounter).toBe(1)
  })

  it('should be the exact same error object.', () => {
    globalErrorStore.setError(createError())
    expect(globalErrorStore.getError()).toStrictEqual(createError())
  })

  it('should be the exact same nested custom error object.', () => {
    globalErrorStore.setError(createCustomError())
    expect(globalErrorStore.getError()).toStrictEqual(createCustomError())
  })
})
