
import { Actions, StoreContext as StoreContext_type } from 'lbrx'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

describe(`StoreContext - value$:`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  const createStateB = () => TestSubjectFactory.createTestSubject_configB()
  let StoresFactory: typeof StoresFactory_type
  let StoreContext: typeof StoreContext_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    StoreContext = provider.StoreContext
  })

  it(`should return store's state value as an observable by invoking the select$ method.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const selectSpy = jest.spyOn(store, `select$`)
    const storeContext = store.getContext()
    expect.assertions(2)
    storeContext.value$.subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
    })
    expect(selectSpy).toBeCalledTimes(1)
  })

  it(`should allow disposing the query context using the observable.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const selectSpy = jest.spyOn(store, `select$`)
    const storeContext = store.getContext()
    const observable = storeContext.value$
    store.disposeObservableQueryContext(observable)
    const subscribeCallback = jest.fn()
    expect.assertions(2)
    observable.subscribe(subscribeCallback)
    expect(selectSpy).toBeCalledTimes(1)
    expect(subscribeCallback).not.toBeCalled()
  })

  it(`should return store's state value as an observable by invoking the select$ method even after disposing.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const selectSpy = jest.spyOn(store, `select$`)
    const storeContext = store.getContext()
    storeContext.dispose()
    expect.assertions(2)
    storeContext.value$.subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
    })
    expect(selectSpy).toBeCalledTimes(1)
  })

  it(`should allow disposing the query context using the observable even after disposing.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const selectSpy = jest.spyOn(store, `select$`)
    const storeContext = store.getContext()
    storeContext.dispose()
    const observable = storeContext.value$
    store.disposeObservableQueryContext(observable)
    const subscribeCallback = jest.fn()
    expect.assertions(2)
    observable.subscribe(subscribeCallback)
    expect(selectSpy).toBeCalledTimes(1)
    expect(subscribeCallback).not.toBeCalled()
  })

  it(`should return store's state value as an observable on a specified action.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const onActionSpy = jest.spyOn(store, `onAction`)
    const storeContext = store.getContext(null, Actions.override)
    expect.assertions(2)
    storeContext.value$.subscribe(value => {
      expect(value).toStrictEqual(createStateA())
    })
    store.override(createStateA())
    expect(onActionSpy).toBeCalledTimes(1)
  })

  it(`should stop evaluating values after it's disposed.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const selectSpy = jest.spyOn(store, `select$`)
    const storeContext = store.getContext()
    const subscribeCallback = jest.fn()
    expect.assertions(2)
    storeContext.value$.subscribe(subscribeCallback)
    store.override(createStateA())
    storeContext.dispose()
    store.override(createStateB())
    expect(selectSpy).toBeCalledTimes(1)
    expect(subscribeCallback).toBeCalledTimes(2)
  })
})
