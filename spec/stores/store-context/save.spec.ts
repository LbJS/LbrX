
import { StoreContext as StoreContext_type } from 'lbrx'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

describe(`StoreContext - save():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type
  let StoreContext: typeof StoreContext_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    StoreContext = provider.StoreContext
  })

  it(`should update the store's state value.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const storeContext = store.getContext()
    const value = storeContext.value
    value.stringValue = `test55`
    storeContext.save()
    const expectedValue = createInitialState()
    expectedValue.stringValue = `test55`
    expect(store.value).toStrictEqual(expectedValue)
    value.stringValue = `test77`
    storeContext.save()
    expectedValue.stringValue = `test77`
    expect(store.value).toStrictEqual(expectedValue)
  })

  it(`should update the store's state value (using value from observable).`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const storeContext = store.getContext()
    let isSecondRun = false
    expect.assertions(2)
    storeContext.value$.subscribe(value => {
      value.stringValue = isSecondRun ? `test77` : `test55`
      isSecondRun = true
    })
    storeContext.save()
    const expectedValue = createInitialState()
    expectedValue.stringValue = `test55`
    expect(store.value).toStrictEqual(expectedValue)
    storeContext.save()
    expectedValue.stringValue = `test77`
    expect(store.value).toStrictEqual(expectedValue)
  })

  it(`should throw if there is no last value yet.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const storeContext = store.getContext()
    expect(() => {
      storeContext.save()
    }).toThrow()
  })

  it(`should throw if the store context is disposed.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const storeContext = store.getContext()
    const value = storeContext.value
    expect(value).toStrictEqual(createInitialState())
    storeContext.dispose()
    expect(() => {
      storeContext.save()
    }).toThrow()
  })
})
