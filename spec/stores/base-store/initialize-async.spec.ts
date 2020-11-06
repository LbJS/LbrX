import { Store } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { of, throwError, timer } from 'rxjs'
import { TestSubjectFactory } from '__test__/factories'
import { TestSubject } from '__test__/test-subjects'

describe(`Store initializeAsync():`, () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  const pureInitialState = TestSubjectFactory.createTestSubject_initial()
  let store: Store<TestSubject>
  let LbrXManager: typeof LbrXManager_type
  let isDev: () => boolean

  beforeEach(async () => {
    const providerModule = await import(`provider`)
    store = providerModule.StoresFactory.createStore<TestSubject>(null)
    LbrXManager = providerModule.LbrXManager
    isDev = providerModule.isDev
  })

  afterEach(() => {
    jest.resetModules()
  })

  it(`should have null as an initial value.`, () => {
    expect(store.value).toBeNull()
  })

  it(`should set the initial value after async initialization with observable.`, async () => {
    await store.initializeAsync(of(initialState))
    expect(store.value).toStrictEqual(pureInitialState)
  })

  it(`should set the initial value after async initialization with promise.`, async () => {
    await store.initializeAsync(Promise.resolve(initialState))
    expect(store.value).toStrictEqual(pureInitialState)
  })

  it(`should return the initial state from observable after async initialization.`, done => {
    store.select$().subscribe(value => {
      expect(value).toStrictEqual(pureInitialState)
      done()
    })
    store.initializeAsync(of(initialState))
  })

  it(`should throw an error on second initialization.`, async () => {
    store.initializeAsync(of(initialState))
    expect(isDev()).toBeTruthy()
    await expect(store.initializeAsync(of(initialState))).rejects.toBeDefined()
  })

  it(`should throw an error on second initialization with delay.`, async () => {
    store.initializeAsync(of(initialState))
    await timer(100).toPromise()
    expect(isDev()).toBeTruthy()
    await expect(store.initializeAsync(of(initialState))).rejects.toBeDefined()
  }, 200)

  it(`should reject if an observable throws an error.`, async () => {
    expect(isDev()).toBeTruthy()
    await expect(store.initializeAsync(throwError(`Error`))).rejects.toBeDefined()
  })

  it(`should have value after loading is finished.`, done => {
    store.isLoading$.subscribe(value => {
      if (!value) {
        expect(store.value).toStrictEqual(pureInitialState)
        done()
      }
    })
    store.initializeAsync(Promise.resolve(initialState))
  }, 100)
})
