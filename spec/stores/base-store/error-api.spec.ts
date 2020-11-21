import { from, timer } from 'rxjs'
import { ErrorFactory, StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { TestSubject } from '__test__/test-subjects'

describe(`Base Store - Error API:`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should have null as the default error value.`, () => {
    const store = StoresFactory.createStore<TestSubject, Error>(createInitialState())
    expect(store.error).toBeNull()
  })

  it(`should return null as the default error value from observable.`, done => {
    const store = StoresFactory.createStore<TestSubject, Error>(createInitialState())
    store.error$.subscribe(value => {
      expect(value).toBeNull()
      done()
    })
  })

  it(`should return a cloned error after setting it.`, () => {
    const store = StoresFactory.createStore<TestSubject, Error>(createInitialState())
    const error = ErrorFactory.createError()
    store.error = error
    expect(store.error).toStrictEqual(ErrorFactory.createError())
    expect(store.error).not.toBe(error)
  })

  it(`should return a cloned error from observable after setting it.`, done => {
    const store = StoresFactory.createStore<TestSubject, Error>(createInitialState())
    const error = ErrorFactory.createError()
    store.error = error
    store.error$.subscribe(value => {
      expect(value).toStrictEqual(ErrorFactory.createError())
      expect(store.error).not.toBe(error)
      done()
    })
  })

  it(`should not emit null value more then once.`, async () => {
    const store = StoresFactory.createStore<TestSubject, Error>(createInitialState())
    let nullCounter = 0
    store.error$.subscribe(value => {
      if (value === null) nullCounter++
    })
    store.error = null
    store.error = null
    store.error = null
    await timer(100).toPromise()
    expect(nullCounter).toBe(1)
  })

  it(`should return the errors data flow from observable.`, async () => {
    const store = StoresFactory.createStore<TestSubject, Error>(createInitialState())
    const errorsStream = [ErrorFactory.createError(), null, null, ErrorFactory.createError()]
    const expectedErrors = [null, ErrorFactory.createError(), null, ErrorFactory.createError()]
    const actualErrors: any[] = []
    store.error$.subscribe(value => actualErrors.push(value))
    from(errorsStream).subscribe(value => store.error = value)
    await Promise.resolve()
    expect(actualErrors).toStrictEqual(expectedErrors)
  })

  it(`should return a cloned object after setting it.`, done => {
    const store = StoresFactory.createStore<TestSubject, { msg: string }>(createInitialState())
    const error = { msg: `Error Data` }
    store.error = error
    expect(store.error).toStrictEqual(error)
    expect(store.error).not.toBe(error)
    store.error$.subscribe(e => {
      expect(e).toStrictEqual(error)
      expect(e).not.toBe(error)
      done()
    })
  })

  it(`should return a string after setting it.`, done => {
    const store = StoresFactory.createStore<TestSubject, string>(createInitialState())
    const error = `Error Data`
    store.error = error
    expect(store.error).toBe(error)
    store.error$.subscribe(e => {
      expect(e).toBe(error)
      done()
    })
  })
})
