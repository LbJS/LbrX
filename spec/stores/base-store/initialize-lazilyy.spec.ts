import { Actions, StoreTags } from 'lbrx'
import { getPromiseState, PromiseStates } from 'lbrx/utils'
import fetch from 'node-fetch'
import { from, of, timer } from 'rxjs'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { Todo } from '__test__/test-subjects'

describe(`Base Store - initializeLazily():`, () => {

  const geTodoItem = (): Promise<Todo> => fetch(`https://jsonplaceholder.typicode.com/todos/1`).then(r => r.json()).catch(() => { })
  const createInitialValue = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should not initialize when using observable if there are no subscribers to select$.`, async () => {
    const store = StoresFactory.createStore(null)
    const lazyInitPromise = store.initializeLazily(of(createInitialValue()))
    await timer(100).toPromise()
    expect(store.value).toBeNull()
    expect(await getPromiseState(lazyInitPromise)).toBe(PromiseStates.pending)
  })

  it(`should not initialize when using promise if there are no subscribers to select$.`, async () => {
    const store = StoresFactory.createStore(null)
    const lazyInitPromise = store.initializeLazily(Promise.resolve(createInitialValue()))
    await timer(100).toPromise()
    expect(store.value).toBeNull()
    expect(await getPromiseState(lazyInitPromise)).toBe(PromiseStates.pending)
  })

  it(`should initialize when using observable if there are subscribers to select$.`, async done => {
    const store = StoresFactory.createStore(null)
    store.select$().subscribe(value => {
      expect(store.value).toStrictEqual(createInitialValue())
      expect(value).toStrictEqual(createInitialValue())
      done()
    })
    await store.initializeLazily(of(createInitialValue()))
  })

  it(`should initialize when using promise if there are subscribers to select$.`, async done => {
    const store = StoresFactory.createStore(null)
    store.select$().subscribe(value => {
      expect(store.value).toStrictEqual(createInitialValue())
      expect(value).toStrictEqual(createInitialValue())
      done()
    })
    await store.initializeLazily(Promise.resolve(createInitialValue()))
  })

  it(`should initialize when using observable as someone subscribes using select$.`, async done => {
    const store = StoresFactory.createStore(null)
    const lazyInitPromise = store.initializeLazily(of(createInitialValue()))
    store.select$().subscribe(value => {
      expect(store.value).toStrictEqual(createInitialValue())
      expect(value).toStrictEqual(createInitialValue())
      done()
    })
    await lazyInitPromise
  })

  it(`should initialize when using promise as someone subscribes using select$.`, async done => {
    const store = StoresFactory.createStore(null)
    const lazyInitPromise = store.initializeLazily(Promise.resolve(createInitialValue()))
    store.select$().subscribe(value => {
      expect(store.value).toStrictEqual(createInitialValue())
      expect(value).toStrictEqual(createInitialValue())
      done()
    })
    await lazyInitPromise
  })

  it(`should reject if invoked twice - scenario 1.`, async () => {
    const store = StoresFactory.createStore(null)
    const lazyInitPromise = store.initializeLazily(Promise.resolve(createInitialValue()))
    store.select$().subscribe(() => { })
    await lazyInitPromise
    await expect(store.initializeLazily(Promise.resolve(createInitialValue()))).rejects.toBeDefined()
  })

  it(`should reject if invoked twice - scenario 2.`, async () => {
    const store = StoresFactory.createStore(null)
    store.select$().subscribe(() => { })
    store.initializeLazily(Promise.resolve(createInitialValue()))
    await expect(store.initializeLazily(Promise.resolve(createInitialValue()))).rejects.toBeDefined()
  })

  it(`should reject if invoked twice - scenario 3.`, async () => {
    const store = StoresFactory.createStore(null)
    store.initializeLazily(Promise.resolve(createInitialValue()))
    const lazyInitPromise = store.initializeLazily(Promise.resolve(createInitialValue()))
    store.select$().subscribe(() => { })
    await expect(lazyInitPromise).rejects.toBeDefined()
  })

  it(`should reject if invoked twice - scenario 4.`, async () => {
    const store = StoresFactory.createStore(null)
    store.initialize(createInitialValue())
    await expect(store.initializeLazily(Promise.resolve(createInitialValue()))).rejects.toBeDefined()
  })

  jest.retryTimes(5)
  it(`should get todo item from promise ajax call.`, async () => {
    const store = StoresFactory.createStore(null)
    const expectedResult = await geTodoItem()
    const lazyInitPromise = store.initializeLazily(geTodoItem())
    store.select$().subscribe(() => { })
    await lazyInitPromise
    expect(store.value).toStrictEqual(expectedResult)
  })

  jest.retryTimes(5)
  it(`should get todo item from observable ajax call.`, async () => {
    const store = StoresFactory.createStore(null)
    const expectedResult = await geTodoItem()
    const lazyInitPromise = store.initializeLazily(from(geTodoItem()))
    store.select$().subscribe(() => { })
    await lazyInitPromise
    expect(store.value).toStrictEqual(expectedResult)
  })

  it(`should set the last action to initAsync.`, async () => {
    const store = StoresFactory.createStore(null)
    store.select$().subscribe(() => { })
    await store.initializeLazily(Promise.resolve(createInitialValue()))
    expect(store[`_lastAction`]).toBe(Actions.initAsync)
  })

  it(`should set the store tag to active.`, async () => {
    const store = StoresFactory.createStore(null)
    expect(store.storeTag).toBe(StoreTags.loading)
    store.select$().subscribe(() => { })
    await store.initializeLazily(Promise.resolve(createInitialValue()))
    expect(store.storeTag).toBe(StoreTags.active)
  })
})
