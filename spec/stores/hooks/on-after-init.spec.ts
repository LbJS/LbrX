import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'
import { TestSubject } from '__test__/test-subjects'

describe(`Store onAfterInit():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const providerModule = await import(`provider`)
    StoresFactory = providerModule.StoresFactory
  })

  it(`should not be implemented by default.`, () => {
    const storeWithoutHooks = StoresFactory.createStore<TestSubject>(null, /*with hooks*/false)
    expect(storeWithoutHooks[`onAfterInit`]).toBeUndefined()
  })

  it(`should be called after initialization if implemented.`, () => {
    const storeWithHooks = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAfterInitSpy = jest.spyOn(storeWithHooks, `onAfterInit`)
    storeWithHooks.initialize(createInitialState())
    expect(onAfterInitSpy).toBeCalledTimes(1)
  })

  it(`should be called after async initialization if implemented.`, async () => {
    const storeWithHooks = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAfterInitSpy = jest.spyOn(storeWithHooks, `onAfterInit`)
    await storeWithHooks.initializeAsync(Promise.resolve(createInitialState()))
    expect(storeWithHooks.value).toBeTruthy()
    expect(onAfterInitSpy).toBeCalledTimes(1)
  })

  it(`should get the currState as an argument.`, done => {
    const storeWithHooks = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAfterInitSpy = jest.spyOn(storeWithHooks, `onAfterInit`)
    onAfterInitSpy.mockImplementation((currState: TestSubject): void => {
      expect(currState).toStrictEqual(createInitialState())
      done()
    })
    storeWithHooks.initialize(createInitialState())
  })

  it(`should allow changing the currState.`, () => {
    const storeWithHooks = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onAfterInitSpy = jest.spyOn(storeWithHooks, `onAfterInit`)
    const localInitialState = createInitialState()
    onAfterInitSpy.mockImplementation((currState: TestSubject): TestSubject => {
      assertNotNullable(currState.innerTestObjectGetSet)
      currState.innerTestObjectGetSet.booleanValue = !currState.innerTestObjectGetSet.booleanValue
      return currState
    })
    storeWithHooks.initialize(localInitialState)
    assertNotNullable(localInitialState.innerTestObjectGetSet)
    localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
    expect(storeWithHooks.value).toStrictEqual(localInitialState)
  })

  it(`should disconnect currState object's references.`, async () => {
    let storeWithHooks = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    let onAfterInitSpy = jest.spyOn(storeWithHooks, `onAfterInit`)
    onAfterInitSpy.mockImplementation((currState: TestSubject): void => {
      assertNotNullable(currState.innerTestObject)
      assertNotNullable(currState.innerTestObject.obj)
      currState.innerTestObject.obj.date.setFullYear(1900)
      assertNotNullable(currState.innerTestObjectGetSet)
      currState.innerTestObjectGetSet.numberValue = 777
    })
    storeWithHooks.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    expect(storeWithHooks.value).toStrictEqual(createInitialState())
    jest.resetAllMocks()
    storeWithHooks = StoresFactory.createStore<TestSubject>(null, `ANOTHER-TEST-STORE`, true/*with hooks*/)
    onAfterInitSpy = jest.spyOn(storeWithHooks, `onAfterInit`)
    let tmpState: TestSubject | null = null
    onAfterInitSpy.mockImplementation((currState: TestSubject): TestSubject => {
      tmpState = currState
      return currState
    })
    storeWithHooks.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    assertNotNullable(tmpState)
    assertNotNullable(tmpState!.innerTestObject)
    assertNotNullable(tmpState!.innerTestObject.obj)
    tmpState!.innerTestObject.obj.date.setFullYear(1900)
    assertNotNullable(tmpState!.innerTestObjectGetSet)
    tmpState!.innerTestObjectGetSet.numberValue = 777
    expect(storeWithHooks.value).toStrictEqual(createInitialState())
  })
})
