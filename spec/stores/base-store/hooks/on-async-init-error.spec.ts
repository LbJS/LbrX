import { StoresFactory as StoresFactory_type } from '__test__/factories'
import { TestSubject } from '__test__/test-subjects'

describe(`Store onAsyncInitError():`, () => {

  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not be implemented by default.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null)
    expect(store[`onAsyncInitError`]).toBeUndefined()
  })

  it(`should be called on async initialization if implemented.`, async () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAsyncInitErrorSpy = jest.spyOn(store, `onAsyncInitError`)
    await store.initializeAsync(Promise.reject())
    expect(onAsyncInitErrorSpy).toBeCalled()
  })

  it(`should get the async error as an argument and the error should not bubble if not returned.`, async () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAsyncInitErrorSpy = jest.spyOn(store, `onAsyncInitError`)
    let error: Error
    onAsyncInitErrorSpy.mockImplementation(x => {
      error = x
    })
    await store.initializeAsync(Promise.reject(new Error()))
    expect(error!).toBeInstanceOf(Error)
  })

  it(`should allow changing the async error.`, async () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAsyncInitErrorSpy = jest.spyOn(store, `onAsyncInitError`)
    onAsyncInitErrorSpy.mockImplementation((error: Error): Error => {
      error.message = `some other text`
      return error
    })
    try {
      await store.initializeAsync(Promise.reject(new Error(`some text`)))
    } catch (e) {
      expect(e.message).toBe(`some other text`)
    }
  })
})
