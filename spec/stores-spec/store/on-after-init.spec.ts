import { StoresFactory as StoresFactory_type, TestSubjectFactory } from 'factories'
// import { assertNotNullable } from 'helpers'
import { Store } from 'lbrx'
import { StoreAfterInit } from 'lbrx/hooks'
import { TestSubject } from 'test-subjects'

describe('Store onAfterInit():', () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const initialState = createInitialState()
  let StoresFactory: typeof StoresFactory_type
  let store: Store<TestSubject> & StoreAfterInit<TestSubject>
  let onAfterInitSpy: jest.SpyInstance<void | TestSubject, [TestSubject]>

  beforeEach(async () => {
    const providerModule = await import('provider')
    StoresFactory = providerModule.StoresFactory
    store = StoresFactory.createStore<TestSubject>(null, /*with hooks*/true)
    onAfterInitSpy = jest.spyOn(store, 'onAfterInit')
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  it('should be called after initialization if implemented.', () => {
    store.initialize(initialState)
    expect(onAfterInitSpy).toBeCalled()
  })

  it('should not be called after initialization if not implemented.', () => {
    delete store.onAfterInit
    store.initialize(initialState)
    expect(onAfterInitSpy).not.toBeCalled()
  })

  // it('should be called after async initialization if implemented.', async () => {
  //   store.initializeAsync(Promise.resolve(initialState))
  //   await Promise.resolve()
  //   expect(store.value).toBeTruthy()
  //   expect(onBeforeInitSpy).toBeCalled()
  // })

  // it('should not be called after async initialization if not implemented.', async () => {
  //   delete store.onBeforeInit
  //   store.initializeAsync(Promise.resolve(initialState))
  //   await Promise.resolve()
  //   expect(store.value).toBeTruthy()
  //   expect(onBeforeInitSpy).not.toBeCalled()
  // })

  // it('should get the nextState as an argument.', done => {
  //   onBeforeInitSpy.mockImplementation((nextState: TestSubject): void => {
  //     expect(nextState).toStrictEqual(initialState)
  //     done()
  //   })
  //   store.initialize(initialState)
  // })

  // it('should allow changing the next state.', () => {
  //   const localInitialState = createInitialState()
  //   onBeforeInitSpy.mockImplementation((nextState: TestSubject): TestSubject => {
  //     assertNotNullable(nextState.innerTestObjectGetSet)
  //     nextState.innerTestObjectGetSet.booleanValue = !nextState.innerTestObjectGetSet.booleanValue
  //     return nextState
  //   })
  //   store.initialize(localInitialState)
  //   assertNotNullable(localInitialState.innerTestObjectGetSet)
  //   localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
  //   expect(store.value).toStrictEqual(localInitialState)
  // })

  // it("should disconnect nextState object's references.", async () => {
  //   onBeforeInitSpy.mockImplementation((nextState: TestSubject): void => {
  //     assertNotNullable(nextState.innerTestObject)
  //     assertNotNullable(nextState.innerTestObject.obj)
  //     nextState.innerTestObject.obj.date.setFullYear(1900)
  //     assertNotNullable(nextState.innerTestObjectGetSet)
  //     nextState.innerTestObjectGetSet.numberValue = 777
  //   })
  //   store.initializeAsync(Promise.resolve(initialState))
  //   await Promise.resolve()
  //   expect(store.value).toStrictEqual(initialState)
  //   jest.resetAllMocks()
  //   store = StoresFactory.createStore<TestSubject>(null, 'ANOTHER-TEST-STORE', true/*with hooks*/)
  //   onBeforeInitSpy = jest.spyOn(store, 'onBeforeInit')
  //   let tmpState: TestSubject | null = null
  //   onBeforeInitSpy.mockImplementation((nextState: TestSubject): TestSubject => {
  //     tmpState = nextState
  //     return nextState
  //   })
  //   store.initializeAsync(Promise.resolve(initialState))
  //   await Promise.resolve()
  //   assertNotNullable(tmpState!)
  //   assertNotNullable(tmpState!.innerTestObject)
  //   assertNotNullable(tmpState!.innerTestObject.obj)
  //   tmpState!.innerTestObject.obj.date.setFullYear(1900)
  //   assertNotNullable(tmpState!.innerTestObjectGetSet)
  //   tmpState!.innerTestObjectGetSet.numberValue = 777
  //   expect(store.value).toStrictEqual(initialState)
  // })
})
