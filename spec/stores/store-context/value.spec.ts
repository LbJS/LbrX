
import { StoreContext as StoreContext_type } from 'lbrx'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

describe(`StoreContext - value:`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type
  let StoreContext: typeof StoreContext_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    StoreContext = provider.StoreContext
  })

  it(`should return store's state value bt invoking the select method.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const selectSpy = jest.spyOn(store, `select`)
    const storeContext = store.getContext()
    expect(storeContext.value).toStrictEqual(createInitialState())
    expect(selectSpy).toBeCalledTimes(1)
  })
})
