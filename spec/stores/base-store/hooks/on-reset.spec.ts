import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'
import { TestSubject } from '__test__/test-subjects'

describe(`Store onReset():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not be implemented by default.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null)
    expect(store[`onReset`]).toBeUndefined()
  })

  it(`should be called on reset if implemented.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onResetSpy = jest.spyOn(store, `onReset`)
    store.initialize(createInitialState())
    store.reset()
    expect(onResetSpy).toBeCalled()
  })

  it(`should receive the nextState and the currSate as arguments and currSate should be readonly.`, done => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onResetSpy = jest.spyOn(store, `onReset`)
    const stateForUpdate = TestSubjectFactory.createTestSubject_configA()
    onResetSpy.mockImplementation((nextState: TestSubject, currSate: Readonly<TestSubject>): void => {
      expect(nextState).toStrictEqual(createInitialState())
      expect(currSate).toStrictEqual(stateForUpdate)
      expect(() => {
        (currSate as TestSubject).booleanValue = !currSate.booleanValue
      }).toThrow()
      done()
    })
    store.initialize(createInitialState())
    store.update(stateForUpdate)
    store.reset()
  })

  it(`should allow changing the next state.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onResetSpy = jest.spyOn(store, `onReset`)
    const localInitialState = createInitialState()
    onResetSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      assertNotNullable(nextState.innerTestObjectGetSet)
      nextState.innerTestObjectGetSet.booleanValue = !nextState.innerTestObjectGetSet.booleanValue
      return nextState
    })
    store.initialize(localInitialState)
    store.reset()
    assertNotNullable(localInitialState.innerTestObjectGetSet)
    localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
    expect(store.value).toStrictEqual(localInitialState)
  })

  it(`should disconnect nextState object's references.`, async () => {
    let store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    let onResetSpy = jest.spyOn(store, `onReset`)
    onResetSpy.mockImplementation((nextState: TestSubject): void => {
      assertNotNullable(nextState.innerTestObject)
      assertNotNullable(nextState.innerTestObject.obj)
      nextState.innerTestObject.obj.date.setFullYear(1900)
      assertNotNullable(nextState.innerTestObjectGetSet)
      nextState.innerTestObjectGetSet.numberValue = 777
    })
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    store.reset()
    expect(store.value).toStrictEqual(createInitialState())
    jest.resetAllMocks()
    store = StoresFactory.createStore<TestSubject>(null, `ANOTHER-TEST-STORE`, /*with hooks*/true)
    onResetSpy = jest.spyOn(store, `onReset`)
    let tmpState: TestSubject | null = null
    onResetSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      tmpState = nextState
      return nextState
    })
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    store.reset()
    assertNotNullable(tmpState as unknown as TestSubject)
    assertNotNullable(tmpState!.innerTestObject)
    assertNotNullable(tmpState!.innerTestObject.obj)
    tmpState!.innerTestObject.obj.date.setFullYear(1900)
    assertNotNullable(tmpState!.innerTestObjectGetSet)
    tmpState!.innerTestObjectGetSet.numberValue = 777
    expect(store.value).toStrictEqual(createInitialState())
  })
})
