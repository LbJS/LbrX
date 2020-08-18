import { StoresFactory as StoresFactory_type, TestSubjectFactory } from 'helpers/factories'
import { assertNotNullable } from 'helpers/functions'
import { TestSubject } from 'helpers/test-subjects'
import { AllStoreHooks } from 'helpers/types'
import { Store } from 'lbrx'

describe('Store onAsyncInitSuccess():', () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const initialState = createInitialState()
  let StoresFactory: typeof StoresFactory_type
  let store: Store<TestSubject> & AllStoreHooks<TestSubject>
  let onAsyncInitSuccessSpy: jest.SpyInstance<void | TestSubject, [TestSubject]>

  beforeEach(async () => {
    const providerModule = await import('provider')
    StoresFactory = providerModule.StoresFactory
    store = StoresFactory.createStore<TestSubject>(null, true/*with hooks*/)
    onAsyncInitSuccessSpy = jest.spyOn(store, 'onAsyncInitSuccess')
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  it('should be called on async initialization if implemented.', async () => {
    await store.initializeAsync(Promise.resolve(initialState))
    expect(onAsyncInitSuccessSpy).toBeCalled()
  })

  it('should not be called on async initialization if not implemented.', async () => {
    delete store.onAsyncInitSuccess
    await store.initializeAsync(Promise.resolve(initialState))
    expect(onAsyncInitSuccessSpy).not.toBeCalled()
  })

  it('should get the async result as an argument.', async done => {
    onAsyncInitSuccessSpy.mockImplementation((result: TestSubject): void => {
      expect(result).toStrictEqual(initialState)
      done()
    })
    await store.initializeAsync(Promise.resolve(initialState))
  })

  it('should allow changing the async result.', async () => {
    const localInitialState = createInitialState()
    onAsyncInitSuccessSpy.mockImplementation((result: TestSubject): TestSubject => {
      assertNotNullable(result.innerTestObjectGetSet)
      result.innerTestObjectGetSet.booleanValue = !result.innerTestObjectGetSet.booleanValue
      return result
    })
    await store.initializeAsync(Promise.resolve(initialState))
    assertNotNullable(localInitialState.innerTestObjectGetSet)
    localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
    expect(store.value).toStrictEqual(localInitialState)
  })
})
