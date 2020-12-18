import { ObservableQueryContext, ObservableQueryContextsList as QuerySelectContextList_type, ObservableQueryContextsListApi } from 'lbrx/internal/stores/store-accessories'
import { Observable } from 'rxjs'
import { StoresFactory as StoresFactory_type } from '__test__/factories'


describe(`Store Accessories - ObservableQueryContextsList:`, () => {

  const createQuerySelectContext = () => ({ isDisposed: false, doSkipOneChangeCheck: false, observable: new Observable() })
  let QuerySelectContextList: typeof QuerySelectContextList_type
  let StoresFactory: typeof StoresFactory_type
  let observableQueryContextsListApi: ObservableQueryContextsListApi

  beforeEach(async () => {
    const provider = await import(`provider`)
    QuerySelectContextList = provider.ObservableQueryContextsList
    StoresFactory = provider.StoresFactory
    observableQueryContextsListApi = {
      isLazyInitContext: () => false,
      initializeLazily: () => { }
    }
  })

  it(`should require a ObservableQueryContextsListApi for the constructor.`, () => {
    const store = StoresFactory.createStore(null)
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    expect(querySelectContextList[`_observableQueryContextsListApi`]).toBe(observableQueryContextsListApi)
  })

  it(`should extend array.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    expect(querySelectContextList).toBeInstanceOf(Array)
  })

  it(`should return length of the query context list.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    expect(querySelectContextList.length).toBe(0)
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    expect(querySelectContextList.length).toBe(2)
  })

  it(`should allow pushing query context.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    const querySelectContext = createQuerySelectContext()
    querySelectContextList.push(querySelectContext)
    expect(querySelectContextList[0]).toBe(querySelectContext)
  })

  it(`should allow disposing a context by index.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    querySelectContextList.push(createQuerySelectContext())
    const querySelectContext = createQuerySelectContext()
    querySelectContextList.push(querySelectContext)
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    expect(querySelectContextList.length).toBe(4)
    expect(querySelectContextList).toContain(querySelectContext)
    expect(querySelectContext.isDisposed).toBeFalsy()
    const result = querySelectContextList.disposeByIndex(1)
    expect(result).toBeTruthy()
    expect(querySelectContextList.length).toBe(3)
    expect(querySelectContextList).not.toContain(querySelectContext)
    expect(querySelectContext.isDisposed).toBeTruthy()
  })

  it(`should ignore when disposing an element by index that doesn't exist.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    expect(querySelectContextList.length).toBe(3)
    const result = querySelectContextList.disposeByIndex(3)
    expect(result).toBeFalsy()
    expect(querySelectContextList.length).toBe(3)
    expect(querySelectContextList.every(x => !x.isDisposed)).toBeTruthy()
  })

  it(`should allow disposing a context by observable.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    querySelectContextList.push(createQuerySelectContext())
    const querySelectContext = createQuerySelectContext()
    querySelectContextList.push(querySelectContext)
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    expect(querySelectContextList.length).toBe(4)
    expect(querySelectContextList).toContain(querySelectContext)
    expect(querySelectContext.isDisposed).toBeFalsy()
    const result = querySelectContextList.disposeByObservable(querySelectContext.observable)
    expect(result).toBeTruthy()
    expect(querySelectContextList.length).toBe(3)
    expect(querySelectContextList).not.toContain(querySelectContext)
    expect(querySelectContext.isDisposed).toBeTruthy()
  })

  it(`should ignore when disposing an element by observable that doesn't exist.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    expect(querySelectContextList.length).toBe(3)
    const querySelectContext = createQuerySelectContext()
    const result = querySelectContextList.disposeByObservable(querySelectContext.observable)
    expect(result).toBeFalsy()
    expect(querySelectContextList.length).toBe(3)
    expect(querySelectContextList.every(x => !x.isDisposed)).toBeTruthy()
  })

  it(`should allow disposing all element at once.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    const numOfRequiredContexts = 3
    const contextsCacheList: ObservableQueryContext[] = []
    for (let i = 0; i < numOfRequiredContexts; i++) {
      const querySelectContext = createQuerySelectContext()
      contextsCacheList.push(querySelectContext)
      querySelectContextList.push(querySelectContext)
    }
    expect(querySelectContextList.length).toBe(numOfRequiredContexts)
    const result = querySelectContextList.disposeAll()
    expect(result).toBe(numOfRequiredContexts)
    expect(querySelectContextList.length).toBe(0)
    expect(contextsCacheList.every(x => x.isDisposed)).toBeTruthy()
  })

  it(`should allow updating all elements that there was a hard reset.`, () => {
    const querySelectContextList = new QuerySelectContextList(observableQueryContextsListApi)
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.push(createQuerySelectContext())
    querySelectContextList.doSkipOneChangeCheck = true
    expect(querySelectContextList.every(x => x.doSkipOneChangeCheck)).toBeTruthy()
    querySelectContextList.doSkipOneChangeCheck = false
    expect(querySelectContextList.every(x => x.doSkipOneChangeCheck)).toBeFalsy()
  })
})
