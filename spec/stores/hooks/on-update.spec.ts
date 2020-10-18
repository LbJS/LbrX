import { Store } from 'lbrx'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'
import { TestSubject } from '__test__/test-subjects'
import { AllStoreHooks } from '__test__/types'

describe(`Store onReset():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const initialState = createInitialState()
  let StoresFactory: typeof StoresFactory_type
  let store: Store<TestSubject> & AllStoreHooks<TestSubject>
  let onUpdateSpy: jest.SpyInstance<void | TestSubject, [TestSubject, Readonly<TestSubject>]>

  beforeEach(async () => {
    const providerModule = await import(`provider`)
    StoresFactory = providerModule.StoresFactory
    store = StoresFactory.createStore<TestSubject>(null, true/*with hooks*/)
    onUpdateSpy = jest.spyOn(store, `onUpdate`)
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  it(`should be called on update if implemented.`, () => {
    store.initialize(initialState)
    store.update(() => ({ stringValue: `some other value` }))
    expect(onUpdateSpy).toBeCalled()
  })

  it(`should not be called on update if not implemented.`, () => {
    delete (store as Partial<AllStoreHooks<any>>).onUpdate
    store.initialize(initialState)
    store.update(() => ({ stringValue: `some other value` }))
    expect(onUpdateSpy).not.toBeCalled()
  })

  it(`should receive the nextState and the currSate as arguments and currSate should be readonly.`, done => {
    const localInitialState = TestSubjectFactory.createTestSubject_initial()
    onUpdateSpy.mockImplementation((nextState: TestSubject, currSate: Readonly<TestSubject>): void => {
      localInitialState.stringValue = `some other value`
      expect(nextState).toStrictEqual(localInitialState)
      expect(currSate).toStrictEqual(initialState)
      expect(() => {
        (currSate as TestSubject).booleanValue = !currSate.booleanValue
      }).toThrow()
      done()
    })
    store.initialize(initialState)
    store.update(() => ({ stringValue: `some other value` }))
  })

  it(`should allow changing the next state.`, () => {
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
    onUpdateSpy.mockImplementation((nextState: TestSubject): void => {
      assertNotNullable(nextState.innerTestObject)
      assertNotNullable(nextState.innerTestObject.obj)
      nextState.innerTestObject.obj.date.setFullYear(1900)
      assertNotNullable(nextState.innerTestObjectGetSet)
      nextState.innerTestObjectGetSet.numberValue = 777
    })
    store.initializeAsync(Promise.resolve(initialState))
    await Promise.resolve()
    store.update(() => ({}))
    expect(store.value).toStrictEqual(initialState)
    jest.resetAllMocks()
    store = StoresFactory.createStore<TestSubject>(null, `ANOTHER-TEST-STORE`, true/*with hooks*/)
    onUpdateSpy = jest.spyOn(store, `onUpdate`)
    let tmpState: TestSubject | null = null
    onUpdateSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      tmpState = nextState
      return nextState
    })
    store.initializeAsync(Promise.resolve(initialState))
    await Promise.resolve()
    store.update(() => ({}))
    assertNotNullable(tmpState!)
    assertNotNullable(tmpState!.innerTestObject)
    assertNotNullable(tmpState!.innerTestObject.obj)
    tmpState!.innerTestObject.obj.date.setFullYear(1900)
    assertNotNullable(tmpState!.innerTestObjectGetSet)
    tmpState!.innerTestObjectGetSet.numberValue = 777
    expect(store.value).toStrictEqual(initialState)
  })
})
