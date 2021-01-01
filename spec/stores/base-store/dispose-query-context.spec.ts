import { Observable } from 'rxjs'
import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - disposeObservableQueryContext():`, () => {

  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should allow disposing a context by observable.`, () => {
    const store = StoresFactory.createStore(null)
    store.get$()
    const observable = store.get$()
    store.get$()
    store.get$()
    expect(store[`_observableQueryContextsList`].length).toBe(4)
    const result = store.disposeObservable(observable)
    expect(result).toBeTruthy()
    expect(store[`_observableQueryContextsList`].length).toBe(3)
  })

  it(`should ignore when disposing an element by observable that doesn't exist.`, () => {
    const store = StoresFactory.createStore(null)
    store.get$()
    store.get$()
    store.get$()
    expect(store[`_observableQueryContextsList`].length).toBe(3)
    const observable = new Observable()
    const result = store.disposeObservable(observable)
    expect(result).toBeFalsy()
    expect(store[`_observableQueryContextsList`].length).toBe(3)
  })
})

