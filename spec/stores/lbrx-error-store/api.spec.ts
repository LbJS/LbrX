import { createCustomError, createError } from 'helpers/test-subjects'
import { LbrxErrorStore } from 'lbrx'
import { skip } from 'rxjs/operators'

describe('Lbrx Error Store API:', () => {

  const errorMsg = 'Some Error.'
  let lbrxErrorStore: LbrxErrorStore<string | Error>

  beforeEach(async () => {
    const providerModule = await import('provider')
    lbrxErrorStore = providerModule.LbrxErrorStore.getStore()
  })

  afterEach(() => {
    jest.resetModules()
  })

  it('should have null as the default error value', () => {
    expect(lbrxErrorStore.getError()).toBeNull()
  })

  it('should return that no error exist by default.', () => {
    expect(lbrxErrorStore.isError()).toBeFalsy()
  })

  it('should return that an error exist after setting a new error.', () => {
    lbrxErrorStore.setError(errorMsg)
    expect(lbrxErrorStore.isError()).toBeTruthy()
  })

  it('should return the error message after setting a new error.', () => {
    lbrxErrorStore.setError(errorMsg)
    expect(lbrxErrorStore.getError()).toBe(errorMsg)
  })

  it('should return the error message from observable after setting a new error.', done => {
    lbrxErrorStore.error$.pipe(skip(1))
      .subscribe(value => {
        expect(value).toBe(errorMsg)
        done()
      })
    lbrxErrorStore.setError(errorMsg)
  }, 100)

  it('should return the errors data flow from observable.', () => {
    const errorsStream = ['First Error', 'Second Error', null, 'Third Error', new Error('Some data')]
    const expectedErrorsStream = [null, 'First Error', 'Second Error', null, 'Third Error', new Error('Some data')]
    const actualErrorsStream: (string | null | Error)[] = []
    lbrxErrorStore.error$.subscribe(value => {
      actualErrorsStream.push(value)
    })
    errorsStream.forEach(value => lbrxErrorStore.setError(value))
    expect(actualErrorsStream).toStrictEqual(expectedErrorsStream)
  })

  it('should not emit null value more then once.', async () => {
    let nullCounter = 0
    lbrxErrorStore.error$.subscribe(value => {
      if (value === null) nullCounter++
    })
    lbrxErrorStore.setError(null)
    lbrxErrorStore.setError(null)
    lbrxErrorStore.setError(null)
    await Promise.resolve()
    expect(nullCounter).toBe(1)
  })

  it('should be the exact same error object.', () => {
    lbrxErrorStore.setError(createError())
    expect(lbrxErrorStore.getError()).toStrictEqual(createError())
  })

  it('should be the exact same nested custom error object.', () => {
    lbrxErrorStore.setError(createCustomError())
    expect(lbrxErrorStore.getError()).toStrictEqual(createCustomError())
  })
})
