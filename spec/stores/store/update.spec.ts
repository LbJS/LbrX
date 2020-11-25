import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { TestSubject } from '__test__/test-subjects'

describe(`Store update():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createPartialState = () => ({ stringValue: `some other string` }) as Partial<TestSubject>
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should update the store's state value with object.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store.update(createPartialState())
    const expectedState = createInitialState()
    expectedState.stringValue = createPartialState().stringValue!
    expect(store.value).toStrictEqual(expectedState)
  })

  it(`should update the store's state value with method.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store.update(createPartialState)
    const expectedState = createInitialState()
    expectedState.stringValue = createPartialState().stringValue!
    expect(store.value).toStrictEqual(expectedState)
  })

  it(`should clone the provided value.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const partialState = createPartialState()
    store.update(partialState)
    partialState.stringValue = `Some new value...`
    const expectedState = createInitialState()
    expectedState.stringValue = createPartialState().stringValue!
    expect(store.value).toStrictEqual(expectedState)
  })

  it(`should clone the provided value if class handler is disabled.`, () => {
    const store = StoresFactory.createStore(createInitialState(), { name: `TEST-STORE`, isClassHandler: false })
    const partialState = createPartialState()
    store.update(partialState)
    partialState.stringValue = `Some new value...`
    const expectedState = createInitialState()
    expectedState.stringValue = createPartialState().stringValue!
    expect(store.value).toStrictEqual(expectedState)
  })

  it(`should throw if the store wasn't initialized.`, () => {
    const store = StoresFactory.createStore(null)
    expect(() => {
      store.update(createInitialState())
    }).toThrow()
  })

  it(`should throw if instanced value is missing and class handler is configured.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store[`_instancedValue`] = null
    expect(() => {
      store.update(createPartialState)
    }).toThrow()
  })

  it(`should throw if store's state value is missing.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store[`_stateSource`].value = null
    expect(() => {
      store.update(createPartialState)
    }).toThrow()
  })

  it(`should ignore if the store is in paused state.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store.isPaused = true
    store.update(createPartialState())
    expect(store.value).toStrictEqual(createInitialState())
  })

  it(`should allow passing custom action name.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const actionName = `myAction`
    store.update(createPartialState(), actionName)
    expect(store[`_lastAction`]).toBe(actionName)
  })
})
