import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - value:`, () => {

  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should return a cloned state's value.`, () => {
    const initialState = { foo: `foo` }
    const store = StoresFactory.createStore(initialState)
    const cloneSpy = jest.spyOn(store, `_clone` as any)
    expect(store.value).toStrictEqual(initialState)
    expect(cloneSpy).toBeCalledTimes(1)
    expect(store.value).not.toBe(initialState)
    expect(cloneSpy).toBeCalledTimes(2)
  })

  it(`should throw before initialization.`, () => {
    const store = StoresFactory.createStore(null)
    expect(() => {
      // tslint:disable-next-line: no-unused-expression
      store.value
    }).toThrow()
  })

  it(`should throw after hard reset and before re-initialization.`, async () => {
    const initialState = { foo: `foo` }
    const store = StoresFactory.createStore(initialState)
    await store.hardReset()
    expect(() => {
      // tslint:disable-next-line: no-unused-expression
      store.value
    }).toThrow()
  })
})
