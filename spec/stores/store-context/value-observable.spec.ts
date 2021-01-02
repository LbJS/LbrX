
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

  it(`should return store's state value as an observable by invoking the get$ method.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const getSpy = jest.spyOn(store, `_get$` as any)
    const storeContext = store.getContext()
    expect.assertions(2)
    storeContext.value$.subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
    })
    expect(getSpy).toBeCalledTimes(1)
  })

  it(`should allow disposing the query context using the observable.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const getSpy = jest.spyOn(store, `_get$` as any)
    const storeContext = store.getContext()
    const observable = storeContext.value$
    store.disposeObservable(observable)
    const subscribeCallback = jest.fn()
    expect.assertions(2)
    observable.subscribe(subscribeCallback)
    expect(getSpy).toBeCalledTimes(1)
    expect(subscribeCallback).not.toBeCalled()
  })

  it(`should return store's state value as an observable by invoking the get$ method even after disposing.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const getSpy = jest.spyOn(store, `_get$` as any)
    const storeContext = store.getContext()
    storeContext.dispose()
    expect.assertions(2)
    storeContext.value$.subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
    })
    expect(getSpy).toBeCalledTimes(1)
  })

  it(`should allow disposing the query context using the observable even after disposing.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const getSpy = jest.spyOn(store, `_get$` as any)
    const storeContext = store.getContext()
    storeContext.dispose()
    const observable = storeContext.value$
    store.disposeObservable(observable)
    const subscribeCallback = jest.fn()
    expect.assertions(2)
    observable.subscribe(subscribeCallback)
    expect(getSpy).toBeCalledTimes(1)
    expect(subscribeCallback).not.toBeCalled()
  })

  it(`should return store's state value as an observable on a specified action.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const storeContext = store.getContext(null, Actions.set)
    expect.assertions(1)
    storeContext.value$.subscribe(value => {
      expect(value).toStrictEqual(createStateA())
    })
    store.set(createStateA())
  })

  it(`should stop evaluating values after it's disposed.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const getSpy = jest.spyOn(store, `_get$` as any)
    const storeContext = store.getContext()
    const subscribeCallback = jest.fn()
    expect.assertions(2)
    storeContext.value$.subscribe(subscribeCallback)
    store.set(createStateA())
    storeContext.dispose()
    store.set(createStateB())
    expect(getSpy).toBeCalledTimes(1)
    expect(subscribeCallback).toBeCalledTimes(2)
  })
})
