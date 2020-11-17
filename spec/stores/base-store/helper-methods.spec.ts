import { StoresFactory as StoresFactory_type } from '__test__/factories'

describe(`Base Store - constructor():`, () => {

  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not clone.`, () => {
    const store = StoresFactory.createStore(null)
    const obj = { foo: `foo` }
    const result = store[`_noClone`](obj)
    expect(result).toBe(obj)
    expect(result).toStrictEqual(obj)
  })

  it(`should not freeze.`, () => {
    const store = StoresFactory.createStore(null)
    const obj = { foo: `foo` }
    const result = store[`_noFreeze`](obj) as any
    result.foo = `foo2`
    expect(result.foo).toBe(`foo2`)
    expect(obj.foo).toBe(`foo2`)
  })

  it(`should compare only references.`, () => {
    const store = StoresFactory.createStore(null)
    const obj = { foo: `foo` }
    expect(store[`_refCompare`](obj, obj)).toBeTruthy()
    expect(store[`_refCompare`](obj, { foo: `foo` })).toBeFalsy()
  })
})
