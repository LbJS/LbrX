import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertNotNullable } from '__test__/functions'
import { TestSubject } from '__test__/test-subjects'

describe(`Store onOverride():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not be implemented by default.`, () => {
    const store = StoresFactory.createStore<TestSubject>(null)
    expect(store[`onOverride`]).toBeUndefined()
  })

  it(`should be called if implemented.`, () => {
    const store = StoresFactory.createStore(createInitialState(), /*with hooks*/true)
    const onOverrideSpy = jest.spyOn(store, `onOverride`)
    store.override(createStateA())
    expect(onOverrideSpy).toBeCalled()
  })

  it(`should get the nextState and the currState as arguments.`, done => {
    const store = StoresFactory.createStore(createInitialState(), /*with hooks*/true)
    const onOverrideSpy = jest.spyOn(store, `onOverride`)
    onOverrideSpy.mockImplementation((nextState: TestSubject, currState: Readonly<TestSubject>): void => {
      expect(nextState).toStrictEqual(createStateA())
      expect(currState).toStrictEqual(createInitialState())
      done()
    })
    store.override(createStateA())
  })

  it(`should allow changing the next state.`, () => {
    const store = StoresFactory.createStore(createInitialState(), /*with hooks*/true)
    const onOverrideSpy = jest.spyOn(store, `onOverride`)
    const localStateA = createStateA()
    onOverrideSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      expect(nextState).toStrictEqual(createStateA())
      assertNotNullable(nextState.dateValue)
      nextState.dateValue.setFullYear(1900)
      return nextState
    })
    store.override(localStateA)
    expect(store.value).not.toStrictEqual(localStateA)
    assertNotNullable(localStateA.dateValue)
    localStateA.dateValue.setFullYear(1900)
    expect(store.value).toStrictEqual(localStateA)
  })

  it(`should supply a readonly current state.`, done => {
    const store = StoresFactory.createStore(createInitialState(), /*with hooks*/true)
    const onOverrideSpy = jest.spyOn(store, `onOverride`)
    onOverrideSpy.mockImplementation((nextState: TestSubject, currState: Readonly<TestSubject>): void => {
      expect(nextState).toStrictEqual(createStateA())
      expect(store.value).toStrictEqual(currState)
      expect(() => {
        assertNotNullable(currState.dateValue)
        currState.dateValue.setFullYear(1900)
      }).toThrow()
      done()
    })
    store.override(createStateA())
  })

  it(`should disconnect nextState object's references.`, () => {
    const store = StoresFactory.createStore(createInitialState(), /*with hooks*/true)
    const onOverrideSpy = jest.spyOn(store, `onOverride`)
    onOverrideSpy.mockImplementation((nextState: TestSubject): void => {
      expect(nextState).toStrictEqual(createStateA())
      assertNotNullable(nextState.dateValue)
      nextState.dateValue.setFullYear(1900)
      nextState.stringValue = `some new value`
    })
    store.override(createStateA())
    expect(store.value).toStrictEqual(createStateA())
    jest.resetAllMocks()
    let tmpState: TestSubject | null = null
    onOverrideSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      expect(nextState).toStrictEqual(createStateA())
      tmpState = nextState
      return nextState
    })
    store.override(createStateA())
    assertNotNullable(tmpState!)
    assertNotNullable(tmpState!.dateValue)
    tmpState!.dateValue.setFullYear(1900)
    tmpState!.stringValue = `some new value`
    expect(store.value).toStrictEqual(createStateA())
  })
})
