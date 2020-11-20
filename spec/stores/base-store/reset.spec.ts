import { Actions, StoreTags } from 'lbrx'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

describe(`Base Store - reset():`, () => {

  const createInitialValue = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should reset the store's value to its initial value.`, () => {
    const store = StoresFactory.createStore(createInitialValue())
    store.update(createStateA())
    store.reset()
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should throw if the store is in loading state.`, () => {
    const store = StoresFactory.createStore(null)
    expect(() => {
      store.reset()
    }).toThrow()
  })

  it(`should throw if the store is not resettable.`, () => {
    const store = StoresFactory.createStore(createInitialValue(), { name: `TEST-STORE`, isResettable: false })
    expect(() => {
      store.reset()
    }).toThrow()
  })

  it(`should throw if the store was not initialized.`, () => {
    const store = StoresFactory.createStore(null)
    expect(() => {
      store.reset()
    }).toThrow()
  })

  it(`should reset the store's state to its initial value with different reference.`, () => {
    const store = StoresFactory.createStore(createInitialValue())
    store.update(createStateA())
    store.reset()
    expect(store[`_value`]).not.toBe(store.initialValue)
  })

  it(`should not reset the store if the store is in paused state.`, () => {
    const store = StoresFactory.createStore(createInitialValue())
    store.update(createStateA())
    store.isPaused = true
    store.reset()
    expect(store.value).toStrictEqual(createStateA())
  })

  it(`should set the last action to reset.`, () => {
    const store = StoresFactory.createStore(createInitialValue())
    store.reset()
    expect(store[`_lastAction`]).toBe(Actions.reset)
  })

  it(`should set the last action to the provided string.`, () => {
    const store = StoresFactory.createStore(createInitialValue())
    store.reset(`CUSTOM-RESET`)
    expect(store[`_lastAction`]).toBe(`CUSTOM-RESET`)
  })

  it(`should keep the store tag active.`, () => {
    const store = StoresFactory.createStore(null)
    store.initialize(createInitialValue())
    expect(store.storeTag).toBe(StoreTags.active)
  })
})

