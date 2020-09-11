import { Store } from 'lbrx'
import { StoresFactory as StoresFactory_type } from '__test__/factories'
import { TestSubject } from '__test__/test-subjects'
import { AllStoreHooks } from '__test__/types'

describe('Store onAsyncInitSuccess():', () => {

  let StoresFactory: typeof StoresFactory_type
  let store: Store<TestSubject> & AllStoreHooks<TestSubject>
  let onAsyncInitErrorSpy: jest.SpyInstance<void | Error, [Error]>

  beforeEach(async () => {
    const providerModule = await import('provider')
    StoresFactory = providerModule.StoresFactory
    store = StoresFactory.createStore<TestSubject>(null, true/*with hooks*/)
    onAsyncInitErrorSpy = jest.spyOn(store, 'onAsyncInitError')
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  it('should be called on async initialization if implemented.', async () => {
    await store.initializeAsync(Promise.reject())
    expect(onAsyncInitErrorSpy).toBeCalled()
  })

  it('should not be called on async initialization if not implemented.', async () => {
    delete (store as Partial<AllStoreHooks<any>>).onAsyncInitError
    await store.initializeAsync(Promise.reject())
    expect(onAsyncInitErrorSpy).not.toBeCalled()
  })

  it('should get the async error as an argument and the error should not bubble if not returned.', async done => {
    onAsyncInitErrorSpy.mockImplementation((error: Error): void => {
      expect(error).toBeInstanceOf(Error)
      done()
    })
    await store.initializeAsync(Promise.reject(new Error()))
  })

  it('should allow changing the async error.', async () => {
    onAsyncInitErrorSpy.mockImplementation((error: Error): Error => {
      error.message = 'some other text'
      return error
    })
    try {
      await store.initializeAsync(Promise.reject(new Error('some text')))
    } catch (e) {
      expect(e.message).toBe('some other text')
    }
  })
})
