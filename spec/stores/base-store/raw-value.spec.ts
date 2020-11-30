import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - rawValue:`, () => {

  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should return a cloned state's value.`, () => {
    const initialState = { foo: `foo` }
    const store = StoresFactory.createStore(initialState)
    const cloneSpy = jest.spyOn(store, `_clone` as any)
    expect(store.rawValue).toStrictEqual(initialState)
    expect(cloneSpy).toBeCalledTimes(1)
    expect(store.rawValue).not.toBe(initialState)
    expect(cloneSpy).toBeCalledTimes(2)
  })

  it(`should return null before initialization.`, () => {
    const store = StoresFactory.createStore(null)
    expect(store.rawValue).toBeNull()
  })
})
