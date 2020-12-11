import { Actions, Storages, StoreTags } from 'lbrx'
import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { timer } from 'rxjs'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { assert } from '__test__/functions'
import MockBuilder from '__test__/mock-builder'
import { TestSubject } from '__test__/test-subjects'

describe(`Base Store - initialize(): `, () => {

  const createInitialValue = () => TestSubjectFactory.createTestSubject_initial()
  const createValueA = () => TestSubjectFactory.createTestSubject_configA()
  const createInitialListValue = () => TestSubjectFactory.createTestSubject_list_initial()
  let StoresFactory: typeof StoresFactory_type
  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    LbrXManager = provider.LbrXManager
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
    expect(store.rawValue).toBeNull()
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

  it(`should use storage value if so configured.`, async () => {
    localStorage.setItem(`TEST-STORE`, JSON.stringify(createInitialValue()))
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE`, storageType: Storages.local })
    store.setInstancedValue(createInitialValue())
    store.initialize(createValueA())
    await timer(store.config.storageDebounceTime).toPromise()
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should ignore class handler when using storage data if so configured.`, async () => {
    localStorage.setItem(`TEST-STORE`, JSON.stringify(createInitialValue()))
    const store = StoresFactory.createStore<TestSubject>(null,
      { name: `TEST-STORE`, storageType: Storages.local, isClassHandler: false })
    store.setInstancedValue(createInitialValue())
    store.initialize(createValueA())
    await timer(store.config.storageDebounceTime).toPromise()
    expect(store.value).toStrictEqual(JSON.parse(localStorage.getItem(`TEST-STORE`) as string))
  })

  it(`should use initial value for instanced handling for storage value if so configured.`, async () => {
    localStorage.setItem(`TEST-STORE`, JSON.stringify(createInitialValue()))
    const store = StoresFactory.createStore<TestSubject>(null, { name: `TEST-STORE`, storageType: Storages.local })
    const instancedValue = createInitialValue()
    instancedValue.numberValue = -9999
    store.initialize(instancedValue)
    await timer(store.config.storageDebounceTime).toPromise()
    expect(store.value).toStrictEqual(createInitialValue())
  })

  it(`should use initial value for instanced handling for storage value if so configured in list store.`, async () => {
    localStorage.setItem(`TEST-STORE`, JSON.stringify(createInitialListValue()))
    const store = StoresFactory.createListStore<TestSubject>(null, { name: `TEST-STORE`, storageType: Storages.local })
    const instancedValue = createInitialListValue()
    instancedValue[0].numberValue = -9999
    store.initialize(instancedValue)
    await timer(store.config.storageDebounceTime).toPromise()
    expect(store.value).toStrictEqual(createInitialListValue())
  })

  it(`should set the first element of the array as an instanced value when initializing a list store.`, () => {
    const data = createInitialListValue()
    data[0].stringValue = `Some Custom Value Here`
    const store = StoresFactory.createListStore<TestSubject>(data)
    const expectedData = createInitialListValue()
    expectedData[0].stringValue = `Some Custom Value Here`
    expect(store.instancedValue).toStrictEqual(expectedData[0])
  })

  // tslint:disable-next-line: max-line-length
  it(`should throw if initializing a list store with an empty array, isClassHandler is configured and the instancedValue is not set.`, () => {
    expect(() => {
      const store = StoresFactory.createListStore<TestSubject>(null)
      store.initialize([])
    }).toThrow()
  })

  // tslint:disable-next-line: max-line-length
  it(`shouldn't throw if initializing a list store with an empty array, isClassHandler is configured and the instancedValue is set.`, () => {
    expect(() => {
      const store = StoresFactory.createListStore<TestSubject>(null)
      store.setInstancedValue(createInitialValue())
      store.initialize([])
    }).not.toThrow()
  })

  it(`shouldn't throw if initializing a list store with an empty array and isClassHandler is not configured.`, () => {
    expect(() => {
      const store = StoresFactory.createListStore<TestSubject>(null, { name: `TEST-STORE`, isClassHandler: false })
      store.initialize([])
    }).not.toThrow()
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

  it(`should freeze the value, the initial value and the instanced value if in devMode.`, () => {
    const store = StoresFactory.createListStore<TestSubject>(null)
    const freezeSpy = jest.spyOn(store, `_freeze` as any)
    store.initialize(createInitialListValue())
    expect(freezeSpy).toBeCalledTimes(2)
    const value = store[`_stateSource`][`value`]
    assert(value)
    expect(() => {
      value[0].numberValue = -1111
    }).toThrow()
    const initialValue = store[`_initialValue`]
    assert(initialValue)
    expect(() => {
      initialValue[0].numberValue = -1111
    }).toThrow()
    const instancedValue = store[`_instancedValue`] as TestSubject
    assert(instancedValue)
    expect(() => {
      instancedValue.numberValue = -1111
    }).toThrow()
  })

  it(`shouldn't freeze the value, the initial value ot the instanced value if not in devMode.`, () => {
    LbrXManager.enableProdMode()
    const store = StoresFactory.createListStore<TestSubject>(null)
    const freezeSpy = jest.spyOn(store, `_freeze` as any)
    store.initialize(createInitialListValue())
    expect(freezeSpy).not.toBeCalled()
    const value = store[`_stateSource`][`value`]
    assert(value)
    expect(() => {
      value[0].numberValue = -1111
    }).not.toThrow()
    const initialValue = store[`_initialValue`]
    assert(initialValue)
    expect(() => {
      initialValue[0].numberValue = -1111
    }).not.toThrow()
    const instancedValue = store[`_instancedValue`] as TestSubject
    assert(instancedValue)
    expect(() => {
      instancedValue.numberValue = -1111
    }).not.toThrow()
  })
})

