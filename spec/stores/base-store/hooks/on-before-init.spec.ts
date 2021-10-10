import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'
import { TestSubject } from '__test__/test-subjects'

describe(`Store onBeforeInit():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not be implemented by default.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null)
    expect(store[`onBeforeInit`]).toBeUndefined()
  })

  it(`should be called before initialization if implemented.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onBeforeInitSpy = jest.spyOn(store, `onBeforeInit`)
    store.initialize(createInitialState())
    expect(onBeforeInitSpy).toBeCalled()
  })

  it(`should be called before async initialization if implemented.`, async () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onBeforeInitSpy = jest.spyOn(store, `onBeforeInit`)
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    expect(store.value).toBeTruthy()
    expect(onBeforeInitSpy).toBeCalled()
  })

  it(`should get the nextState as an argument.`, done => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onBeforeInitSpy = jest.spyOn(store, `onBeforeInit`)
    onBeforeInitSpy.mockImplementation((nextState: TestSubject): void => {
      expect(nextState).toStrictEqual(createInitialState())
      done()
    })
    store.initialize(createInitialState())
  })

  it(`should allow changing the next state.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onBeforeInitSpy = jest.spyOn(store, `onBeforeInit`)
    const localInitialState = createInitialState()
    onBeforeInitSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      assertNotNullable(nextState.innerTestObjectGetSet)
      nextState.innerTestObjectGetSet.booleanValue = !nextState.innerTestObjectGetSet.booleanValue
      return nextState
    })
    store.initialize(localInitialState)
    assertNotNullable(localInitialState.innerTestObjectGetSet)
    localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
    expect(store.value).toStrictEqual(localInitialState)
  })

  it(`should disconnect nextState object's references.`, async () => {
    let store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    let onBeforeInitSpy = jest.spyOn(store, `onBeforeInit`)
    onBeforeInitSpy.mockImplementation((nextState: TestSubject): void => {
      assertNotNullable(nextState.innerTestObject)
      assertNotNullable(nextState.innerTestObject.obj)
      nextState.innerTestObject.obj.date.setFullYear(1900)
      assertNotNullable(nextState.innerTestObjectGetSet)
      nextState.innerTestObjectGetSet.numberValue = 777
    })
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    expect(store.value).toStrictEqual(createInitialState())
    jest.resetAllMocks()
    store = StoresFactory.createStore<TestSubject>(null, `ANOTHER-TEST-STORE`, /*with hooks*/true)
    onBeforeInitSpy = jest.spyOn(store, `onBeforeInit`)
    let tmpState: TestSubject | null = null
    onBeforeInitSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      tmpState = nextState
      return nextState
    })
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    assertNotNullable(tmpState as unknown as TestSubject)
    assertNotNullable(tmpState!.innerTestObject)
    assertNotNullable(tmpState!.innerTestObject.obj)
    tmpState!.innerTestObject.obj.date.setFullYear(1900)
    assertNotNullable(tmpState!.innerTestObjectGetSet)
    tmpState!.innerTestObjectGetSet.numberValue = 777
    expect(store.value).toStrictEqual(createInitialState())
  })
})
