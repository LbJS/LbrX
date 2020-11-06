import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'
import { TestSubject } from '__test__/test-subjects'

describe(`Store onAfterInit():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not be implemented by default.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null)
    expect(store[`onAfterInit`]).toBeUndefined()
  })

  it(`should be called after initialization if implemented.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAfterInitSpy = jest.spyOn(store, `onAfterInit`)
    store.initialize(createInitialState())
    expect(onAfterInitSpy).toBeCalledTimes(1)
  })

  it(`should be called after async initialization if implemented.`, async () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAfterInitSpy = jest.spyOn(store, `onAfterInit`)
    await store.initializeAsync(Promise.resolve(createInitialState()))
    expect(store.value).toBeTruthy()
    expect(onAfterInitSpy).toBeCalledTimes(1)
  })

  it(`should get the currState as an argument.`, done => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAfterInitSpy = jest.spyOn(store, `onAfterInit`)
    onAfterInitSpy.mockImplementation((currState: TestSubject): void => {
      expect(currState).toStrictEqual(createInitialState())
      done()
    })
    store.initialize(createInitialState())
  })

  it(`should allow changing the currState.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAfterInitSpy = jest.spyOn(store, `onAfterInit`)
    const localInitialState = createInitialState()
    onAfterInitSpy.mockImplementation((currState: TestSubject): TestSubject => {
      assertNotNullable(currState.innerTestObjectGetSet)
      currState.innerTestObjectGetSet.booleanValue = !currState.innerTestObjectGetSet.booleanValue
      return currState
    })
    store.initialize(localInitialState)
    assertNotNullable(localInitialState.innerTestObjectGetSet)
    localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
    expect(store.value).toStrictEqual(localInitialState)
  })

  it(`should disconnect currState object's references.`, async () => {
    let store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    let onAfterInitSpy = jest.spyOn(store, `onAfterInit`)
    onAfterInitSpy.mockImplementation((currState: TestSubject): void => {
      assertNotNullable(currState.innerTestObject)
      assertNotNullable(currState.innerTestObject.obj)
      currState.innerTestObject.obj.date.setFullYear(1900)
      assertNotNullable(currState.innerTestObjectGetSet)
      currState.innerTestObjectGetSet.numberValue = 777
    })
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    expect(store.value).toStrictEqual(createInitialState())
    jest.resetAllMocks()
    store = StoresFactory.createStore<TestSubject>(null, `ANOTHER-TEST-STORE`, /*with hooks*/true)
    onAfterInitSpy = jest.spyOn(store, `onAfterInit`)
    let tmpState: TestSubject | null = null
    onAfterInitSpy.mockImplementation((currState: TestSubject): TestSubject => {
      tmpState = currState
      return currState
    })
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    assertNotNullable(tmpState)
    assertNotNullable(tmpState!.innerTestObject)
    assertNotNullable(tmpState!.innerTestObject.obj)
    tmpState!.innerTestObject.obj.date.setFullYear(1900)
    assertNotNullable(tmpState!.innerTestObjectGetSet)
    tmpState!.innerTestObjectGetSet.numberValue = 777
    expect(store.value).toStrictEqual(createInitialState())
  })
})
