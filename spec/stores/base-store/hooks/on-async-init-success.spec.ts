import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'
import { TestSubject } from '__test__/test-subjects'

describe(`Store onAsyncInitSuccess():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not be implemented by default.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null)
    expect(store[`onAsyncInitSuccess`]).toBeUndefined()
  })

  it(`should be called on async initialization if implemented.`, async () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAsyncInitSuccessSpy = jest.spyOn(store, `onAsyncInitSuccess`)
    await store.initializeAsync(Promise.resolve(createInitialState()))
    expect(onAsyncInitSuccessSpy).toBeCalled()
  })

  it(`should get the async result as an argument.`, async done => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAsyncInitSuccessSpy = jest.spyOn(store, `onAsyncInitSuccess`)
    onAsyncInitSuccessSpy.mockImplementation((result: TestSubject): void => {
      expect(result).toStrictEqual(createInitialState())
      done()
    })
    await store.initializeAsync(Promise.resolve(createInitialState()))
  })

  it(`should allow changing the async result.`, async () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAsyncInitSuccessSpy = jest.spyOn(store, `onAsyncInitSuccess`)
    const localInitialState = createInitialState()
    onAsyncInitSuccessSpy.mockImplementation((result: TestSubject): TestSubject => {
      assertNotNullable(result.innerTestObjectGetSet)
      result.innerTestObjectGetSet.booleanValue = !result.innerTestObjectGetSet.booleanValue
      return result
    })
    await store.initializeAsync(Promise.resolve(createInitialState()))
    assertNotNullable(localInitialState.innerTestObjectGetSet)
    localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
    expect(store.value).toStrictEqual(localInitialState)
  })
})
