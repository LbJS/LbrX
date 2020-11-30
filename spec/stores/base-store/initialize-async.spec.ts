import { Actions, StoreTags } from 'lbrx'
import { createPromiseContext } from 'lbrx/internal/stores/store-accessories'
import fetch from 'node-fetch'
import { from, of, throwError, timer } from 'rxjs'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assert } from '__test__/functions'
import { Todo } from '__test__/test-subjects'

describe(`Base Store - initializeAsync():`, () => {

  const geTodoItem = (): Promise<Todo> => fetch(`https://jsonplaceholder.typicode.com/todos/1`).then(r => r.json()).catch(() => { })
  const createInitialValue = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should have null as an initial value.`, () => {
    const store = StoresFactory.createStore(null)
    expect(store.rawValue).toBeNull()
  })

  it(`should set the initial value after async initialization with observable.`, async () => {
    const store = StoresFactory.createStore(null)
    await store.initializeAsync(of(createInitialValue()))
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should set the initial value after async initialization with promise.`, async () => {
    const store = StoresFactory.createStore(null)
    await store.initializeAsync(Promise.resolve(createInitialValue()))
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should return the initial state from observable after async initialization.`, done => {
    const store = StoresFactory.createStore(null)
    store.select$().subscribe(value => {
      expect(value).toStrictEqual(createInitialValue())
      done()
    })
    store.initializeAsync(of(createInitialValue()))
  })

  it(`should throw an error on second initialization.`, async () => {
    const store = StoresFactory.createStore(null)
    store.initializeAsync(of(createInitialValue()))
    await expect(store.initializeAsync(of(createInitialValue()))).rejects.toBeDefined()
  })

  it(`should throw an error on second initialization after delay.`, async () => {
    const store = StoresFactory.createStore(null)
    store.initializeAsync(of(createInitialValue()))
    await timer(100).toPromise()
    await expect(store.initializeAsync(of(createInitialValue()))).rejects.toBeDefined()
  })

  it(`should reject if an observable throws an error.`, async () => {
    const store = StoresFactory.createStore(null)
    await expect(store.initializeAsync(throwError(`Error`))).rejects.toBeDefined()
  })

  it(`should have value after loading is finished.`, done => {
    const store = StoresFactory.createStore(null)
    store.isLoading$.subscribe(value => {
      if (!value) {
        expect(store.value).toStrictEqual(createInitialValue())
        done()
      }
    })
    store.initializeAsync(Promise.resolve(createInitialValue()))
  })

  it(`should create asyncInitPromiseContext.`, () => {
    const store = StoresFactory.createStore(null)
    const expectedResult = createPromiseContext()
    expectedResult.promise = store.initializeAsync(Promise.resolve(createInitialValue()))
    expect(store[`_asyncInitPromiseContext`]).toStrictEqual(expectedResult)
  })

  it(`should not finish initializing the store if the promise context was canceled.`, async () => {
    const store = StoresFactory.createStore(null)
    const initializationPromise = store.initializeAsync(Promise.resolve(createInitialValue()))
    assert(store[`_asyncInitPromiseContext`])
    store[`_asyncInitPromiseContext`].isCancelled = true
    await expect(initializationPromise).resolves.toBeUndefined()
    expect(store.rawValue).toBeNull()
  })

  it(`should not finish initializing the store if the promise context was canceled even if the promise rejects.`, async () => {
    const store = StoresFactory.createStore(null)
    const initializationPromise = store.initializeAsync(Promise.reject())
    assert(store[`_asyncInitPromiseContext`])
    store[`_asyncInitPromiseContext`].isCancelled = true
    await expect(initializationPromise).resolves.toBeUndefined()
  })

  jest.retryTimes(5)
  it(`should get todo item from promise ajax call.`, async () => {
    const store = StoresFactory.createStore(null)
    const expectedResult = await geTodoItem()
    await store.initializeAsync(geTodoItem())
    expect(store.value).toStrictEqual(expectedResult)
  })

  jest.retryTimes(5)
  it(`should get todo item from observable ajax call.`, async () => {
    const store = StoresFactory.createStore(null)
    const expectedResult = await geTodoItem()
    await store.initializeAsync(from(geTodoItem()))
    expect(store.value).toStrictEqual(expectedResult)
  })

  it(`should set the last action to initAsync.`, async () => {
    const store = StoresFactory.createStore(null)
    await store.initializeAsync(Promise.resolve(createInitialValue()))
    expect(store[`_lastAction`]).toBe(Actions.initAsync)
  })

  it(`should set the store tag to active.`, async () => {
    const store = StoresFactory.createStore(null)
    expect(store.storeTag).toBe(StoreTags.loading)
    await store.initializeAsync(Promise.resolve(createInitialValue()))
    expect(store.storeTag).toBe(StoreTags.active)
  })
})
