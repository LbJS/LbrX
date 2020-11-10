import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - instancedValue:`, () => {

  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should be null before initialization.`, () => {
    const store = StoresFactory.createStore(null)
    expect(store.instancedValue).toBeNull()
  })

  it(`should have value after initialization.`, () => {
    const store = StoresFactory.createStore(null)
    const initialValue = { foo: `foo` }
    store.initialize(initialValue)
    expect(store.instancedValue).toStrictEqual(initialValue)
  })

  it(`should return a readonly value.`, () => {
    const store = StoresFactory.createStore({ foo: `foo` })
    expect(() => {
      const value: any = store.instancedValue
      value.foo = `foo2`
    }).toThrow()
  })

  it(`should allow setting a new instanced value.`, () => {
    const newInstancedValue = {
      foo: `foo`,
      date: new Date(),
    }
    const store = StoresFactory.createStore({ foo: `foo` })
    store.setInstancedValue(newInstancedValue)
    expect(store.instancedValue).toStrictEqual(newInstancedValue)
  })

  it(`should clone and freeze the new instanced value when setting it.`, () => {
    const newInstancedValue = {
      foo: `foo`,
      date: new Date(),
    }
    const store = StoresFactory.createStore({ foo: `foo` })
    const cloneSpy = jest.spyOn(store, `_clone` as any)
    const freezeSpy = jest.spyOn(store, `_freeze` as any)
    store.setInstancedValue(newInstancedValue)
    expect(cloneSpy).toBeCalledTimes(1)
    expect(freezeSpy).toBeCalledTimes(1)
    expect(store.instancedValue).not.toBe(newInstancedValue)
    expect(() => {
      const value: any = store.instancedValue
      value.foo = `foo2`
    }).toThrow()
  })
})
