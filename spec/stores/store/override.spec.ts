import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assertEqual, assertNotNullable } from '__test__/functions'
import { DeepNestedTestSubject, InnerTestSubject, TestSubject } from '__test__/test-subjects'

describe(`Store - override():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  const createPlainStateA = () => TestSubjectFactory.createTestSubject_configA_plain()
  const createStateB = () => TestSubjectFactory.createTestSubject_configB()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should override the store's state value.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    expect(store.value).toStrictEqual(createInitialState())
    store.override(createStateA())
    expect(store.value).toStrictEqual(createStateA())
  })

  it(`should get the expected steam of states.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const expectedStates = [
      createInitialState(),
      createStateB(),
      createStateA(),
      createStateB(),
      createInitialState(),
    ]
    let index = 0
    expect.assertions(expectedStates.length)
    store.select$().subscribe(value => {
      expect(value).toStrictEqual(expectedStates[index++])
    })
    store.override(createStateB())
    store.override(createStateA())
    store.override(createStateB())
    store.override(createInitialState())
  })

  it(`should clone the value.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const localStateA = createStateA()
    store.override(localStateA)
    expect(store.value).not.toBe(localStateA)
    expect(store.value).toStrictEqual(createStateA())
    assertNotNullable(localStateA.dateValue)
    localStateA.dateValue.setFullYear(1900)
    assertEqual(localStateA.dateValue.getFullYear(), 1900)
    expect(store.value).toStrictEqual(createStateA())
  })

  it(`should clone the provided value if class handler is disabled.`, () => {
    const store = StoresFactory.createStore(createInitialState(), { name: `TEST-STORE`, isClassHandler: false })
    const localStateA = createStateA()
    store.override(localStateA)
    expect(store.value).not.toBe(localStateA)
    expect(store.value).toStrictEqual(createStateA())
    assertNotNullable(localStateA.dateValue)
    localStateA.dateValue.setFullYear(1900)
    assertEqual(localStateA.dateValue.getFullYear(), 1900)
    expect(store.value).toStrictEqual(createStateA())
  })

  it(`should handle instances for plain object.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store.override(createStateA())
    expect(store.value).toStrictEqual(createStateA())
    store.override(createPlainStateA())
    expect(store.value).toStrictEqual(createStateA())
    expect(store.value).toBeInstanceOf(TestSubject)
    assertNotNullable(store.value)
    expect(store.value.innerTestObject).toBeInstanceOf(InnerTestSubject)
    expect(store.value.innerTestObject?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubject)
    expect(store.value.innerTestObjectGetSet).toBeInstanceOf(InnerTestSubject)
    expect(store.value.innerTestObjectGetSet?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubject)
  })

  it(`should throw if the store wasn't initialized.`, () => {
    const store = StoresFactory.createStore(null)
    expect(() => {
      store.override(createStateA())
    }).toThrow()
  })

  it(`should throw if instanced value is missing and class handler is configured.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store[`_instancedValue`] = null
    expect(() => {
      store.override(createStateA())
    }).toThrow()
  })

  it(`should throw if store's state value is missing.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store[`_stateSource`].value = null
    expect(() => {
      store.override(createStateA())
    }).toThrow()
  })

  it(`should ignore if the store is in paused state.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store.isPaused = true
    store.override(createStateA())
    expect(store.value).toStrictEqual(createInitialState())
  })

  it(`should allow passing custom action name.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const actionName = `myAction`
    store.update(createStateA(), actionName)
    expect(store[`_lastAction`]).toBe(actionName)
  })
})
