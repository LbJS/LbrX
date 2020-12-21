
import { StoreContext as StoreContext_type } from 'lbrx'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

describe(`StoreContext - dispose():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type
  let StoreContext: typeof StoreContext_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    StoreContext = provider.StoreContext
  })

  it(`should dispose the store context.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const storeContext = store.getContext()
    const observable = storeContext.value$
    storeContext.dispose()
    expect(storeContext[`_lastValue`]).toBeNull()
    expect(storeContext[`_selectObservable`]).toBeNull()
    expect(storeContext[`_isDisposed`]).toBeTruthy()
    expect(store[`_observableQueryContextsList`].every(x => x.observable != observable)).toBeTruthy()
  })
})
