
import { StoreContext as StoreContext_type } from 'lbrx'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

describe(`StoreContext - isDisposed:`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type
  let StoreContext: typeof StoreContext_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    StoreContext = provider.StoreContext
  })

  it(`should return false before it's disposed.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const storeContext = store.getContext()
    expect(storeContext.isDisposed).toBeFalsy()
  })

  it(`should return true after it's disposed.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const storeContext = store.getContext()
    storeContext.dispose()
    expect(storeContext.isDisposed).toBeTruthy()
  })
})
