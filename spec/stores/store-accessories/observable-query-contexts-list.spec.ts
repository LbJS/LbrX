import { ObservableQueryContext, ObservableQueryContextsList as ObservableQueryContextsList_type, ObservableQueryContextsListApi } from 'lbrx/internal/stores/store-accessories'
import { Observable } from 'rxjs'
import { StoresFactory as StoresFactory_type } from '__test__/factories'


describe(`Store Accessories - ObservableQueryContextsList:`, () => {

  const createObservableQueryContext = () => ({ isDisposed: false, doSkipOneChangeCheck: false, observable: new Observable() })
  let ObservableQueryContextsList: typeof ObservableQueryContextsList_type
  let StoresFactory: typeof StoresFactory_type
  let observableQueryContextsListApi: ObservableQueryContextsListApi

  beforeEach(async () => {
    const provider = await import(`provider`)
    ObservableQueryContextsList = provider.ObservableQueryContextsList
    StoresFactory = provider.StoresFactory
    observableQueryContextsListApi = {
      isLazyInitContext: () => false,
      initializeLazily: () => { }
    }
  })

  it(`should require a ObservableQueryContextsListApi for the constructor.`, () => {
    const store = StoresFactory.createStore(null)
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    expect(observableQueryContextsList[`_observableQueryContextsListApi`]).toBe(observableQueryContextsListApi)
  })

  it(`should extend array.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    expect(observableQueryContextsList).toBeInstanceOf(Array)
  })

  it(`should return length of the query context list.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    expect(observableQueryContextsList.length).toBe(0)
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    expect(observableQueryContextsList.length).toBe(2)
  })

  it(`should allow pushing query context.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    const observableQueryContext = createObservableQueryContext()
    observableQueryContextsList.push(observableQueryContext)
    expect(observableQueryContextsList[0]).toBe(observableQueryContext)
  })

  it(`should allow disposing a context by index.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    observableQueryContextsList.push(createObservableQueryContext())
    const observableQueryContext = createObservableQueryContext()
    observableQueryContextsList.push(observableQueryContext)
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    expect(observableQueryContextsList.length).toBe(4)
    expect(observableQueryContextsList).toContain(observableQueryContext)
    expect(observableQueryContext.isDisposed).toBeFalsy()
    const result = observableQueryContextsList.disposeByIndex(1)
    expect(result).toBeTruthy()
    expect(observableQueryContextsList.length).toBe(3)
    expect(observableQueryContextsList).not.toContain(observableQueryContext)
    expect(observableQueryContext.isDisposed).toBeTruthy()
  })

  it(`should ignore when disposing an element by index that doesn't exist.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    expect(observableQueryContextsList.length).toBe(3)
    const result = observableQueryContextsList.disposeByIndex(3)
    expect(result).toBeFalsy()
    expect(observableQueryContextsList.length).toBe(3)
    expect(observableQueryContextsList.every(x => !x.isDisposed)).toBeTruthy()
  })

  it(`should allow disposing a context by observable.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    observableQueryContextsList.push(createObservableQueryContext())
    const observableQueryContext = createObservableQueryContext()
    observableQueryContextsList.push(observableQueryContext)
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    expect(observableQueryContextsList.length).toBe(4)
    expect(observableQueryContextsList).toContain(observableQueryContext)
    expect(observableQueryContext.isDisposed).toBeFalsy()
    const result = observableQueryContextsList.disposeByObservable(observableQueryContext.observable)
    expect(result).toBeTruthy()
    expect(observableQueryContextsList.length).toBe(3)
    expect(observableQueryContextsList).not.toContain(observableQueryContext)
    expect(observableQueryContext.isDisposed).toBeTruthy()
  })

  it(`should ignore when disposing an element by observable that doesn't exist.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    expect(observableQueryContextsList.length).toBe(3)
    const observableQueryContext = createObservableQueryContext()
    const result = observableQueryContextsList.disposeByObservable(observableQueryContext.observable)
    expect(result).toBeFalsy()
    expect(observableQueryContextsList.length).toBe(3)
    expect(observableQueryContextsList.every(x => !x.isDisposed)).toBeTruthy()
  })

  it(`should allow disposing all element at once.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    const numOfRequiredContexts = 3
    const contextsCacheList: ObservableQueryContext<any>[] = []
    for (let i = 0; i < numOfRequiredContexts; i++) {
      const observableQueryContext = createObservableQueryContext()
      contextsCacheList.push(observableQueryContext)
      observableQueryContextsList.push(observableQueryContext)
    }
    expect(observableQueryContextsList.length).toBe(numOfRequiredContexts)
    const result = observableQueryContextsList.disposeAll()
    expect(result).toBe(numOfRequiredContexts)
    expect(observableQueryContextsList.length).toBe(0)
    expect(contextsCacheList.every(x => x.isDisposed)).toBeTruthy()
  })

  it(`should allow updating all elements that there was a hard reset.`, () => {
    const observableQueryContextsList = new ObservableQueryContextsList(observableQueryContextsListApi)
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.push(createObservableQueryContext())
    observableQueryContextsList.doSkipOneChangeCheck = true
    expect(observableQueryContextsList.every(x => x.doSkipOneChangeCheck)).toBeTruthy()
    observableQueryContextsList.doSkipOneChangeCheck = false
    expect(observableQueryContextsList.every(x => x.doSkipOneChangeCheck)).toBeFalsy()
  })
})
