import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - initialValue:`, () => {

  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should be null before initialization.`, () => {
    const store = StoresFactory.createStore(null)
    expect(store.initialValue).toBeNull()
  })

  it(`should have value after initialization.`, () => {
    const store = StoresFactory.createStore(null)
    const initialValue = { foo: `foo` }
    store.initialize(initialValue)
    expect(store.initialValue).toStrictEqual(initialValue)
  })

  it(`should return a readonly value.`, () => {
    const store = StoresFactory.createStore({ foo: `foo` })
    expect(() => {
      const value: any = store.initialValue
      value.foo = `foo2`
    }).toThrow()
  })
})
