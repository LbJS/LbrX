import { QueryContext, QueryContextsList as QueryContextList_type, QueryContextsListApi } from 'lbrx/internal/stores/store-accessories'
import { Observable } from 'rxjs'
import { StoresFactory as StoresFactory_type } from '__test__/factories'


describe(`Store Accessories - QueryContextsList:`, () => {

  const createQueryContext = () => ({ isDisposed: false, doSkipOneChangeCheck: false, observable: new Observable() })
  let QueryContextList: typeof QueryContextList_type
  let StoresFactory: typeof StoresFactory_type
  let queryContextsListApi: QueryContextsListApi

  beforeEach(async () => {
    const provider = await import(`provider`)
    QueryContextList = provider.QueryContextsList
    StoresFactory = provider.StoresFactory
    queryContextsListApi = {
      isLazyInitContext: () => false,
      initializeLazily: () => { }
    }
  })

  it(`should require a QueryContextsListApi for the constructor.`, () => {
    const store = StoresFactory.createStore(null)
    const queryContextList = new QueryContextList(queryContextsListApi)
    expect(queryContextList[`_queryContextsListApi`]).toBe(queryContextsListApi)
  })

  it(`should extend array.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    expect(queryContextList).toBeInstanceOf(Array)
  })

  it(`should return length of the query context list.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    expect(queryContextList.length).toBe(0)
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    expect(queryContextList.length).toBe(2)
  })

  it(`should allow pushing query context.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    const queryContext = createQueryContext()
    queryContextList.push(queryContext)
    expect(queryContextList[0]).toBe(queryContext)
  })

  it(`should allow disposing a context by index.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    queryContextList.push(createQueryContext())
    const queryContext = createQueryContext()
    queryContextList.push(queryContext)
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    expect(queryContextList.length).toBe(4)
    expect(queryContextList).toContain(queryContext)
    expect(queryContext.isDisposed).toBeFalsy()
    const result = queryContextList.disposeByIndex(1)
    expect(result).toBeTruthy()
    expect(queryContextList.length).toBe(3)
    expect(queryContextList).not.toContain(queryContext)
    expect(queryContext.isDisposed).toBeTruthy()
  })

  it(`should ignore when disposing an element by index that doesn't exist.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    expect(queryContextList.length).toBe(3)
    const result = queryContextList.disposeByIndex(3)
    expect(result).toBeFalsy()
    expect(queryContextList.length).toBe(3)
    expect(queryContextList.every(x => !x.isDisposed)).toBeTruthy()
  })

  it(`should allow disposing a context by observable.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    queryContextList.push(createQueryContext())
    const queryContext = createQueryContext()
    queryContextList.push(queryContext)
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    expect(queryContextList.length).toBe(4)
    expect(queryContextList).toContain(queryContext)
    expect(queryContext.isDisposed).toBeFalsy()
    const result = queryContextList.disposeByObservable(queryContext.observable)
    expect(result).toBeTruthy()
    expect(queryContextList.length).toBe(3)
    expect(queryContextList).not.toContain(queryContext)
    expect(queryContext.isDisposed).toBeTruthy()
  })

  it(`should ignore when disposing an element by observable that doesn't exist.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    expect(queryContextList.length).toBe(3)
    const queryContext = createQueryContext()
    const result = queryContextList.disposeByObservable(queryContext.observable)
    expect(result).toBeFalsy()
    expect(queryContextList.length).toBe(3)
    expect(queryContextList.every(x => !x.isDisposed)).toBeTruthy()
  })

  it(`should allow disposing all element at once.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    const numOfRequiredContexts = 3
    const contextsCacheList: QueryContext[] = []
    for (let i = 0; i < numOfRequiredContexts; i++) {
      const queryContext = createQueryContext()
      contextsCacheList.push(queryContext)
      queryContextList.push(queryContext)
    }
    expect(queryContextList.length).toBe(numOfRequiredContexts)
    const result = queryContextList.disposeAll()
    expect(result).toBe(numOfRequiredContexts)
    expect(queryContextList.length).toBe(0)
    expect(contextsCacheList.every(x => x.isDisposed)).toBeTruthy()
  })

  it(`should allow updating all elements that there was a hard reset.`, () => {
    const queryContextList = new QueryContextList(queryContextsListApi)
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    queryContextList.push(createQueryContext())
    queryContextList.doSkipOneChangeCheck = true
    expect(queryContextList.every(x => x.doSkipOneChangeCheck)).toBeTruthy()
    queryContextList.doSkipOneChangeCheck = false
    expect(queryContextList.every(x => x.doSkipOneChangeCheck)).toBeFalsy()
  })
})
