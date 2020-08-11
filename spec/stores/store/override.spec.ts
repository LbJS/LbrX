import { TestSubjectFactory } from 'helpers/factories'
import { assertEqual, assertNotNullable } from 'helpers/functions'
import { DeepNestedTestSubject, InnerTestSubject, TestSubject } from 'helpers/test-subjects'
import { Store } from 'lbrx'

describe('Store override():', () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  const stateA = createStateA()
  const stateB = TestSubjectFactory.createTestSubject_configB()
  let store: Store<TestSubject>

  beforeEach(async () => {
    const providerModule = await import('provider')
    store = providerModule.StoresFactory.createStore(initialState)
  })

  afterEach(() => {
    jest.resetModules()
  })

  it("should override the store's state value.", () => {
    expect(store.state).toStrictEqual(initialState)
    const localStateA = createStateA()
    store.override(localStateA)
    const expectedState = createStateA()
    expect(store.state).toStrictEqual(expectedState)
  })

  it('should get the expected steam of states.', done => {
    const expectedStates = [
      initialState,
      stateB,
      stateA,
      stateB,
      initialState,
    ]
    let index = 0
    store.select$().subscribe(value => {
      expect(value).toStrictEqual(expectedStates[index++])
      if (index == expectedStates.length) done()
    })
    store.override(stateB)
    store.override(stateA)
    store.override(stateB)
    store.override(initialState)
  }, 100)

  it('should disconnect object reference.', () => {
    const localStateA = createStateA()
    store.override(localStateA)
    expect(store.state).not.toBe(localStateA)
    expect(store.state).toStrictEqual(localStateA)
    assertNotNullable(localStateA.dateValue)
    localStateA.dateValue.setFullYear(1900)
    assertEqual(localStateA.dateValue.getFullYear(), 1900)
    const expectedState = createStateA()
    expect(store.state).toStrictEqual(expectedState)
  })

  it('should handle instances for plain object.', () => {
    store.override(stateA)
    expect(store.state).toStrictEqual(stateA)
    const plainStateA = TestSubjectFactory.createTestSubject_configA_plain()
    store.override(plainStateA)
    expect(store.state).toStrictEqual(stateA)
    expect(store.state).toBeInstanceOf(TestSubject)
    assertNotNullable(store.state)
    expect(store.state.innerTestObject).toBeInstanceOf(InnerTestSubject)
    expect(store.state.innerTestObject?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubject)
    expect(store.state.innerTestObjectGetSet).toBeInstanceOf(InnerTestSubject)
    expect(store.state.innerTestObjectGetSet?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubject)
  })
})
