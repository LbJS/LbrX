import { Actions, Storages, StoreTags } from 'lbrx'
import { timer } from 'rxjs'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import MockBuilder from '__test__/mock-builder'
import { TestSubject } from '__test__/test-subjects'

describe(`Base Store - initialize(): `, () => {

  const createInitialValue = () => TestSubjectFactory.createTestSubject_initial()
  const createValueA = () => TestSubjectFactory.createTestSubject_configA()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    MockBuilder.addWindowMock()
      .addLocalStorageMock()
      .buildMocks()
  })

  it(`should set the initial value as the first state.`, () => {
    const store = StoresFactory.createStore(createInitialValue())
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should set the initial value to store's initial value property.`, () => {
    const store = StoresFactory.createStore(createInitialValue())
    expect(store.value).toStrictEqual(store.initialValue)
  })

  it(`should return the initial state from an observable.`, done => {
    const store = StoresFactory.createStore(createInitialValue())
    store.select$().subscribe(value => {
      expect(value).toStrictEqual(createInitialValue())
      done()
    })
  })

  it(`should have null as an initial value.`, () => {
    const store = StoresFactory.createStore(null)
    expect(store.value).toBeNull()
  })

  it(`should set the initial value after initialization.`, () => {
    const store = StoresFactory.createStore(null)
    store.initialize(createInitialValue())
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should return the initial state from observable after initialization.`, done => {
    const store = StoresFactory.createStore(null)
    store.select$().subscribe(value => {
      expect(value).toStrictEqual(createInitialValue())
      done()
    })
    store.initialize(createInitialValue())
  })

  it(`should throw an error on second initialization.`, () => {
    const store = StoresFactory.createStore(null)
    store.initialize(createInitialValue())
    expect(() => {
      store.initialize(createInitialValue())
    }).toThrow()
  })

  it(`should have value after loading is finished.`, done => {
    const store = StoresFactory.createStore(null)
    store.isLoading$.subscribe(isLoading => {
      if (!isLoading) {
        expect(store.value).toStrictEqual(createInitialValue())
        done()
      }
    })
    store.initialize(createInitialValue())
  })

  it(`should use stored value if so configured.`, async () => {
    localStorage.setItem(`TEST-STORE`, JSON.stringify(createInitialValue()))
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE`, storageType: Storages.local })
    store.setInstancedValue(createInitialValue())
    store.initialize(createValueA())
    await timer(store.config.storageDebounceTime).toPromise()
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should ignore instance handler when using stored data if so configured.`, async () => {
    localStorage.setItem(`TEST-STORE`, JSON.stringify(createInitialValue()))
    const store = StoresFactory.createStore<TestSubject>(null,
      { name: `TEST-STORE`, storageType: Storages.local, isInstanceHandler: false })
    store.setInstancedValue(createInitialValue())
    store.initialize(createValueA())
    await timer(store.config.storageDebounceTime).toPromise()
    expect(store.value).toStrictEqual(JSON.parse(localStorage.getItem(`TEST-STORE`) as string))
  })

  it(`should use initial value for instanced handling for stored value if so configured.`, async () => {
    localStorage.setItem(`TEST-STORE`, JSON.stringify(createInitialValue()))
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE`, storageType: Storages.local })
    const instancedValue = createInitialValue()
    instancedValue.numberValue = -9999
    store.initialize(instancedValue)
    await timer(store.config.storageDebounceTime).toPromise()
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should set the last action to init.`, () => {
    const store = StoresFactory.createStore(null)
    store.initialize(createInitialValue())
    expect(store[`_lastAction`]).toBe(Actions.init)
  })

  it(`should set the store tag to active.`, () => {
    const store = StoresFactory.createStore(null)
    expect(store.storeTag).toBe(StoreTags.loading)
    store.initialize(createInitialValue())
    expect(store.storeTag).toBe(StoreTags.active)
  })
})
