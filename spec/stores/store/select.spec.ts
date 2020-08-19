import { sleep } from 'helpers/functions'
import { InnerTestSubject, Store, TestSubject, TestSubjectFactory } from 'provider'
import { Observable } from 'rxjs'

describe('Store select$():', () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  const createStateB = () => TestSubjectFactory.createTestSubject_configB()
  const customObjA = () => Object.assign(createStateA(), { stringValue: 'new string 1' } as TestSubject)
  const customObjB = () => Object.assign(createStateA(),
    { innerTestObject: Object.assign(createStateA().innerTestObject, { numberValue: 777 } as InnerTestSubject) } as TestSubject)
  let store: Store<TestSubject>
  let asyncStore: Store<TestSubject>

  beforeEach(async () => {
    const provider = await import('provider')
    store = provider.StoresFactory.createStore<TestSubject>(createInitialState())
    asyncStore = provider.StoresFactory.createStore<TestSubject>(null, 'ASYNC-STORE')
  })


  it("should distribute store's state on subscribe.", done => {
    expect.assertions(1)
    store.select$().subscribe(state => {
      expect(state).toStrictEqual(createInitialState())
      done()
    })
  })

  it("should distribute store's state when it's updated.", async done => {
    expect.assertions(2)
    const jestMatcherState = expect.getState()
    const expectedStates = [
      createInitialState(),
      createStateA(),
    ]
    store.select$().subscribe(state => {
      expect(state).toStrictEqual(expectedStates[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == 2) done()
    })
    await sleep()
    store.update(createStateA())
  })

  it("should distribute store's state when it's updated but only when it changes.", async done => {
    const jestMatcherState = expect.getState()
    const expectedStates = [
      createInitialState(),
      createStateA(),
      createStateB(),
      customObjA(),
      customObjB(),
    ]
    const numOfAssertions = expectedStates.length
    expect.assertions(numOfAssertions)
    store.select$().subscribe(state => {
      expect(state).toStrictEqual(expectedStates[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    await sleep()
    store.update(createInitialState())
    await sleep()
    store.update(createStateA())
    await sleep()
    store.update(createStateA())
    await sleep()
    store.update(createStateB())
    await sleep()
    store.update(createStateB())
    await sleep()
    store.update(customObjA())
    await sleep()
    store.update(customObjA())
    await sleep()
    store.update(customObjB())
  })

  it('should distribute the selected property based on the provided projection method.', done => {
    expect.assertions(1)
    store.select$(state => state.stringValue).subscribe(value => {
      expect(value).toStrictEqual(createInitialState().stringValue)
      done()
    })
  })

  it('should distribute the selected property based on the provided projection method only when it changes.', async done => {
    const jestMatcherState = expect.getState()
    const expectedValues = [
      createInitialState().stringValue,
      customObjA().stringValue,
      'my new str',
    ]
    const numOfAssertions = expectedValues.length
    expect.assertions(numOfAssertions)
    store.select$(state => state.stringValue).subscribe(value => {
      expect(value).toStrictEqual(expectedValues[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    await sleep()
    store.update(createInitialState())
    await sleep()
    store.update(customObjA())
    await sleep()
    store.update(customObjA())
    await sleep()
    store.update({ stringValue: expectedValues[2] } as TestSubject)
    await sleep()
    store.update({ stringValue: expectedValues[2] } as TestSubject)
  })

  it('should distribute the selected nested property based on the provided projection method.', done => {
    expect.assertions(1)
    store.select$(state => state.innerTestObject!.deepNestedObj!.objectList).subscribe(value => {
      expect(value).toStrictEqual(createInitialState().innerTestObject!.deepNestedObj!.objectList)
      done()
    })
  })

  it('should distribute the selected property based on the provided projection method only when it changes.', async done => {
    const jestMatcherState = expect.getState()
    const expectedValues = [
      createInitialState().innerTestObject!.deepNestedObj!.objectList,
      createStateA().innerTestObject!.deepNestedObj!.objectList,
    ]
    const numOfAssertions = expectedValues.length
    expect.assertions(numOfAssertions)
    store.select$(state => state.innerTestObject!.deepNestedObj!.objectList).subscribe(value => {
      expect(value).toStrictEqual(expectedValues[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    await sleep()
    store.update(createInitialState())
    await sleep()
    store.update(createStateA())
    await sleep()
    store.update(createStateA())
  })

  it('should allow casting to newly defined object.', async done => {
    expect.assertions(1)
    const expectedValue = {
      s: createInitialState().stringValue,
      n: createInitialState().numberValue,
    }
    store.select$(state => ({
      s: state.stringValue,
      n: state.numberValue,
    })).subscribe(value => {
      expect(value).toStrictEqual(expectedValue)
      done()
    })
  })

  it('should distribute the newly casted object only when one if its properties changed.', async done => {
    const jestMatcherState = expect.getState()
    const expectedValues = [
      {
        s: createInitialState().stringValue,
        n: createInitialState().numberValue,
      },
      {
        s: 'a777a',
        n: createInitialState().numberValue,
      },
      {
        s: createInitialState().stringValue,
        n: createInitialState().numberValue,
      },
      {
        s: 'a777a',
        n: createInitialState().numberValue,
      },
      {
        s: 'a777a',
        n: 123454321
      },
    ]
    const numOfAssertions = expectedValues.length
    expect.assertions(numOfAssertions)
    store.select$(state => ({
      s: state.stringValue,
      n: state.numberValue,
    })).subscribe(value => {
      expect(value).toStrictEqual(expectedValues[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    await sleep()
    store.update({ stringValue: 'a777a' })
    await sleep()
    store.update({ stringValue: 'a777a' })
    await sleep()
    store.update(createInitialState())
    await sleep()
    store.update(createInitialState())
    await sleep()
    store.update({ stringValue: 'a777a' })
    await sleep()
    store.update({ stringValue: 'a777a' })
    await sleep()
    store.update({ numberValue: 123454321 })
    await sleep()
    store.update({ numberValue: 123454321 })
  })

  it("shouldn't distribute null as a state on async store before initialization.", async () => {
    const mockCb = jest.fn()
    asyncStore.select$().subscribe(mockCb)
    expect(mockCb).not.toBeCalled()
    await sleep(100)
  })

  it("shouldn't distribute null on hard reset.", async () => {
    const mockCb = jest.fn()
    store.select$().subscribe(mockCb)
    expect(mockCb).toBeCalledTimes(1)
    await sleep()
    await store.hardReset()
    await sleep(100)
  })

  it('should distribute the initial state after hard reset even if it is the same state.', async done => {
    const jestMatcherState = expect.getState()
    const expectedValues = [
      createInitialState(),
      createInitialState(),
    ]
    const numOfAssertions = expectedValues.length
    expect.assertions(numOfAssertions)
    store.select$(state => state).subscribe(value => {
      expect(value).toStrictEqual(expectedValues[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    await sleep()
    await store.hardReset()
    await sleep(1)
    store.initialize(createInitialState())
    await sleep()
  })

  it('should compile when provided with an optional parameter.', () => {
    function stateProjectionFactory<R>(optionalProjection?: (state: Readonly<TestSubject>) => R): Observable<TestSubject | R> {
      return store.select$(optionalProjection)
    }
    stateProjectionFactory()
    stateProjectionFactory(state => state.booleanValue)
  })
})
