import { TestSubjectFactory } from 'helpers/factories'
import { assertNotNullable } from 'helpers/functions'
import { TestSubject } from 'helpers/test-subjects'
import { Store } from 'lbrx'
import { StoreOnOverride } from 'lbrx/hooks'

describe('Store onOverride():', () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  const stateA = createStateA()
  let store: Store<TestSubject> & StoreOnOverride<TestSubject>
  let onOverrideSpy: jest.SpyInstance<void | TestSubject, [TestSubject, Readonly<TestSubject>]>

  beforeEach(async () => {
    const providerModule = await import('provider')
    store = providerModule.StoresFactory.createStore(initialState, true/*with hooks*/)
    onOverrideSpy = jest.spyOn(store, 'onOverride')
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  it('should be called if implemented.', () => {
    store.override(stateA)
    expect(onOverrideSpy).toBeCalled()
  })

  it("shouldn't be called if not implemented.", () => {
    delete store.onOverride
    store.override(stateA)
    expect(onOverrideSpy).not.toBeCalled()
  })

  it('should get the nextState and the currState as arguments.', done => {
    onOverrideSpy.mockImplementation((nextState: TestSubject, currState: Readonly<TestSubject>): void => {
      expect(nextState).toStrictEqual(stateA)
      expect(currState).toStrictEqual(initialState)
      done()
    })
    store.override(stateA)
  })

  it('should allow changing the next state.', () => {
    const localStateA = createStateA()
    onOverrideSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      assertNotNullable(nextState.dateValue)
      nextState.dateValue.setFullYear(1900)
      return nextState
    })
    store.override(localStateA)
    expect(store.state).not.toStrictEqual(localStateA)
    assertNotNullable(localStateA.dateValue)
    localStateA.dateValue.setFullYear(1900)
    expect(store.state).toStrictEqual(localStateA)
  })

  it('should supply a readonly current state.', done => {
    onOverrideSpy.mockImplementation((nextState: TestSubject, currState: Readonly<TestSubject>): void => {
      expect(() => {
        assertNotNullable(currState.dateValue)
        currState.dateValue.setFullYear(1900)
      }).toThrow()
      done()
    })
    store.override(stateA)
  })

  it("should disconnect nextState object's references.", () => {
    onOverrideSpy.mockImplementation((nextState: TestSubject): void => {
      assertNotNullable(nextState.dateValue)
      nextState.dateValue.setFullYear(1900)
      nextState.stringValue = 'some new value'
    })
    store.override(stateA)
    expect(store.state).toStrictEqual(stateA)
    jest.resetAllMocks()
    let tmpState: TestSubject | null = null
    onOverrideSpy.mockImplementation((nextState: TestSubject): TestSubject => {
      tmpState = nextState
      return nextState
    })
    store.override(stateA)
    assertNotNullable(tmpState!)
    assertNotNullable(tmpState!.dateValue)
    tmpState!.dateValue.setFullYear(1900)
    tmpState!.stringValue = 'some new value'
    expect(store.state).toStrictEqual(stateA)
  })
})
