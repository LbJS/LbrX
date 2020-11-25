import { TestSubjectFactory } from 'factories'
import { assertEqual, assertNotNullable } from 'helpers'
import { Store } from 'lbrx'
import { DeepNestedTestSubject, InnerTestSubject, TestSubject } from 'test-subjects'

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
    expect(store.value).toStrictEqual(initialState)
    const localStateA = createStateA()
    store.override(localStateA)
    const expectedState = createStateA()
    expect(store.value).toStrictEqual(expectedState)
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
    expect(store.value).not.toBe(localStateA)
    expect(store.value).toStrictEqual(localStateA)
    assertNotNullable(localStateA.dateValue)
    localStateA.dateValue.setFullYear(1900)
    assertEqual(localStateA.dateValue.getFullYear(), 1900)
    const expectedState = createStateA()
    expect(store.value).toStrictEqual(expectedState)
  })

  it('should handle instances for plain object.', () => {
    store.override(stateA)
    expect(store.value).toStrictEqual(stateA)
    const plainStateA = TestSubjectFactory.createTestSubject_configA_plain()
    store.override(plainStateA)
    expect(store.value).toStrictEqual(stateA)
    expect(store.value).toBeInstanceOf(TestSubject)
    expect(store.value.innerTestObject).toBeInstanceOf(InnerTestSubject)
    expect(store.value.innerTestObject?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubject)
    expect(store.value.innerTestObjectGetSet).toBeInstanceOf(InnerTestSubject)
    expect(store.value.innerTestObjectGetSet?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubject)
  })
})
