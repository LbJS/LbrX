import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Store value:`, () => {

  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should return a cloned state's value.`, () => {
    const initialState = { foo: `foo` }
    const store = StoresFactory.createStore(initialState, { name: `TEST-STORE` })
    const cloneSpy = jest.spyOn(store, `_clone` as any)
    expect(store.value).toStrictEqual(initialState)
    expect(cloneSpy).toBeCalledTimes(1)
    expect(store.value).not.toBe(initialState)
    expect(cloneSpy).toBeCalledTimes(2)
  })
})
