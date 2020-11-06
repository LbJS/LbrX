import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'
import { TestSubject } from '__test__/test-subjects'

describe(`Store onUpdate():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not be implemented by default.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null)
    expect(store[`onUpdate`]).toBeUndefined()
  })

  it(`should be called on update if implemented.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onUpdateSpy = jest.spyOn(store, `onUpdate`)
    store.initialize(createInitialState())
    store.update(() => ({ stringValue: `some other value` }))
    expect(onUpdateSpy).toBeCalled()
  })

  it(`should receive the nextState and the currSate as arguments and currSate should be readonly.`, done => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onUpdateSpy = jest.spyOn(store, `onUpdate`)
    const localInitialState = TestSubjectFactory.createTestSubject_initial()
    onUpdateSpy.mockImplementation((nextState: TestSubject, currSate: Readonly<TestSubject>): void => {
      localInitialState.stringValue = `some other value`
      expect(nextState).toStrictEqual(localInitialState)
      expect(currSate).toStrictEqual(createInitialState())
      expect(() => {
        (currSate as TestSubject).booleanValue = !currSate.booleanValue
      }).toThrow()
      done()
    })
    store.initialize(createInitialState())
    store.update(() => ({ stringValue: `some other value` }))
  })

  it(`should allow changing the next state.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    const onUpdateSpy = jest.spyOn(store, `onUpdate`)
    const localInitialState = createInitialState()
    onUpdateSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      assertNotNullable(nextState.innerTestObjectGetSet)
      nextState.innerTestObjectGetSet.booleanValue = !nextState.innerTestObjectGetSet.booleanValue
      return nextState
    })
    store.initialize(localInitialState)
    store.update(() => ({}))
    assertNotNullable(localInitialState.innerTestObjectGetSet)
    localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
    expect(store.value).toStrictEqual(localInitialState)
  })

  it(`should disconnect nextState object's references.`, async () => {
    let store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    let onUpdateSpy = jest.spyOn(store, `onUpdate`)
    onUpdateSpy.mockImplementation((nextState: TestSubject): void => {
      assertNotNullable(nextState.innerTestObject)
      assertNotNullable(nextState.innerTestObject.obj)
      nextState.innerTestObject.obj.date.setFullYear(1900)
      assertNotNullable(nextState.innerTestObjectGetSet)
      nextState.innerTestObjectGetSet.numberValue = 777
    })
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    store.update(() => ({}))
    expect(store.value).toStrictEqual(createInitialState())
    jest.resetAllMocks()
    store = StoresFactory.createStore<TestSubject>(null, `ANOTHER-TEST-STORE`, /*with hooks*/true)
    onUpdateSpy = jest.spyOn(store, `onUpdate`)
    let tmpState: TestSubject | null = null
    onUpdateSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      tmpState = nextState
      return nextState
    })
    store.initializeAsync(Promise.resolve(createInitialState()))
    await Promise.resolve()
    store.update(() => ({}))
    assertNotNullable(tmpState!)
    assertNotNullable(tmpState!.innerTestObject)
    assertNotNullable(tmpState!.innerTestObject.obj)
    tmpState!.innerTestObject.obj.date.setFullYear(1900)
    assertNotNullable(tmpState!.innerTestObjectGetSet)
    tmpState!.innerTestObjectGetSet.numberValue = 777
    expect(store.value).toStrictEqual(createInitialState())
  })
})
