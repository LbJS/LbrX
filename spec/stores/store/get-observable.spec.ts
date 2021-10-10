import { ProjectsOrKeys } from 'lbrx/query'
import { Observable } from 'rxjs'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { sleep } from '__test__/functions'
import { InnerTestSubject, TestSubject } from '__test__/test-subjects'

describe(`Store - get$():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  const createStateB = () => TestSubjectFactory.createTestSubject_configB()
  const customObjA = () => Object.assign(createStateA(), { stringValue: `new string 1` } as TestSubject)
  const customObjB = () => Object.assign(createStateA(),
    { innerTestObject: Object.assign(createStateA().innerTestObject, { numberValue: 777 } as InnerTestSubject) } as TestSubject)
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })


  it(`should emit store's state value on subscribe.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    expect.assertions(1)
    store.get$().subscribe(state => {
      expect(state).toStrictEqual(createInitialState())
      done()
    })
  })

  it(`should emit store's state value when it's updated.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    expect.assertions(2)
    const jestMatcherState = expect.getState()
    const expectedStates = [
      createInitialState(),
      createStateA(),
    ]
    store.get$().subscribe(state => {
      expect(state).toStrictEqual(expectedStates[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == 2) done()
    })
    store.update(createStateA())
  })

  it(`should emit store's state value only when it changes.`, done => {
    const store = StoresFactory.createStore(createInitialState())
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
    store.get$().subscribe(state => {
      expect(state).toStrictEqual(expectedStates[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    store.update(createInitialState())
    store.update(createStateA())
    store.update(createStateA())
    store.update(createStateB())
    store.update(createStateB())
    store.update(customObjA())
    store.update(customObjA())
    store.update(customObjB())
  })

  it(`should emit the resolved property based on the provided projection method.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    expect.assertions(1)
    store.get$(state => state.stringValue).subscribe(value => {
      expect(value).toStrictEqual(createInitialState().stringValue)
      done()
    })
  })

  it(`should emit the resolved property based on the provided projection method only when it changes.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    const jestMatcherState = expect.getState()
    const expectedValues = [
      createInitialState().stringValue,
      customObjA().stringValue,
      `my new str`,
    ]
    const numOfAssertions = expectedValues.length
    expect.assertions(numOfAssertions)
    store.get$(state => state.stringValue).subscribe(value => {
      expect(value).toStrictEqual(expectedValues[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    store.update(createInitialState())
    store.update(customObjA())
    store.update(customObjA())
    store.update({ stringValue: expectedValues[2] } as TestSubject)
    store.update({ stringValue: expectedValues[2] } as TestSubject)
  })

  it(`should emit the resolved nested property based on the provided projection method.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    expect.assertions(1)
    store.get$(state => state.innerTestObject!.deepNestedObj!.objectList).subscribe(value => {
      expect(value).toStrictEqual(createInitialState().innerTestObject!.deepNestedObj!.objectList)
      done()
    })
  })

  it(`should emit the resolved property based on the provided projection method only when it changes.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    const jestMatcherState = expect.getState()
    const expectedValues = [
      createInitialState().innerTestObject!.deepNestedObj!.objectList,
      createStateA().innerTestObject!.deepNestedObj!.objectList,
    ]
    const numOfAssertions = expectedValues.length
    expect.assertions(numOfAssertions)
    store.get$(state => state.innerTestObject!.deepNestedObj!.objectList).subscribe(value => {
      expect(value).toStrictEqual(expectedValues[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    store.update(createInitialState())
    store.update(createStateA())
    store.update(createStateA())
  })

  it(`should allow casting to newly defined object.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    expect.assertions(1)
    const expectedValue = {
      s: createInitialState().stringValue,
      n: createInitialState().numberValue,
    }
    store.get$(state => ({
      s: state.stringValue,
      n: state.numberValue,
    })).subscribe(value => {
      expect(value).toStrictEqual(expectedValue)
      done()
    })
  })

  it(`should emit the newly casted object only when one if its properties changed.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    const jestMatcherState = expect.getState()
    const expectedValues = [
      {
        s: createInitialState().stringValue,
        n: createInitialState().numberValue,
      },
      {
        s: `a777a`,
        n: createInitialState().numberValue,
      },
      {
        s: createInitialState().stringValue,
        n: createInitialState().numberValue,
      },
      {
        s: `a777a`,
        n: createInitialState().numberValue,
      },
      {
        s: `a777a`,
        n: 123454321
      },
    ]
    const numOfAssertions = expectedValues.length
    expect.assertions(numOfAssertions)
    store.get$(state => ({
      s: state.stringValue,
      n: state.numberValue,
    })).subscribe(value => {
      expect(value).toStrictEqual(expectedValues[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    store.update({ stringValue: `a777a` })
    store.update({ stringValue: `a777a` })
    store.update(createInitialState())
    store.update(createInitialState())
    store.update({ stringValue: `a777a` })
    store.update({ stringValue: `a777a` })
    store.update({ numberValue: 123454321 })
    store.update({ numberValue: 123454321 })
  })

  it(`should emit a value based on an array of projection methods.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const initialState = createInitialState()
    const expectedResult = [initialState.dateValue, initialState.innerTestObject]
    store.get$([
      value => value.dateValue,
      value => value.innerTestObject
    ]).subscribe(value => {
      expect(value).toStrictEqual(expectedResult)
    })
  })

  it(`should emit a value based on a key value.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    store.get$(`stringValue`).subscribe(value => {
      expect(value).toStrictEqual(createInitialState().stringValue)
    })
  })

  it(`should emit a value based on an array of key values.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const initialState = createInitialState()
    const expectedResult: Partial<TestSubject> = {
      stringValue: initialState.stringValue,
      numberValue: initialState.numberValue,
      dateValue: initialState.dateValue,
    }
    store.get$([`stringValue`, `numberValue`, `dateValue`]).subscribe(value => {
      expect(value).toStrictEqual(expectedResult)
    })
  })

  it(`shouldn't emit null before initialization.`, async () => {
    const store = StoresFactory.createStore(null)
    const mockCb = jest.fn()
    store.get$().subscribe(mockCb)
    await sleep(100)
    expect(mockCb).not.toBeCalled()
  })

  it(`shouldn't emit null after hard reset.`, async () => {
    const store = StoresFactory.createStore(createInitialState())
    const mockCb = jest.fn()
    store.get$().subscribe(mockCb)
    expect(mockCb).toBeCalledTimes(1)
    await sleep()
    await store.hardReset()
    await sleep(100)
    expect(mockCb).toBeCalledTimes(1)
  })

  it(`should emit the initial state after hard reset even if it is the same state.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    const jestMatcherState = expect.getState()
    const expectedValues = [
      createInitialState(),
      createInitialState(),
    ]
    const numOfAssertions = expectedValues.length
    expect.assertions(numOfAssertions)
    store.get$(state => state).subscribe(value => {
      expect(value).toStrictEqual(expectedValues[jestMatcherState.assertionCalls])
      if (jestMatcherState.assertionCalls == numOfAssertions) done()
    })
    store.hardReset().then(() => {
      store.initialize(createInitialState())
    })
  })

  it(`should emit a value after the store is initialized.`, done => {
    const store = StoresFactory.createStore(null)
    expect.assertions(2)
    store.get$().subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
    })
    store.get$().subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
      done()
    })
    store.initialize(createInitialState())
  })

  it(`should emit a value after the store is initialized after hard reset.`, done => {
    const store = StoresFactory.createStore(null)
    expect.assertions(4)
    store.get$().subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
    })
    store.get$().subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
      const jestState = expect.getState()
      if (jestState.assertionCalls == jestState.expectedAssertionsNumber) done()
    })
    store.initialize(createInitialState())
    store.hardReset().then(() => {
      store.initializeLazily(Promise.resolve(createInitialState()))
    })
  })

  it(`should compile when provided with an optional parameter.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    function stateProjectionFactory<R, K extends keyof TestSubject>(optionalProjection?: ProjectsOrKeys<TestSubject, R>):
      Observable<TestSubject | R | R[] | TestSubject[K] | Pick<TestSubject, K>> {
      return store.get$(optionalProjection)
    }
    stateProjectionFactory()
    stateProjectionFactory(state => state.booleanValue)
    stateProjectionFactory([
      value => value.dateValue,
      value => value.dateValue
    ])
    stateProjectionFactory(`numberValue`)
    stateProjectionFactory([`stringValue`, `numberValue`, `dateValue`])
  })

  it(`it should emit the whole value if the provided parameter is invalid array.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    expect.assertions(2)
    store.get$([]).subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
    })
    store.get$([`stringValue`, (value: any) => value.stringValue] as any).subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
      done()
    })
  })

  it(`should stop emitting values if the query context has been disposed.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const observable = store.get$()
    expect.assertions(1)
    observable.subscribe(value => {
      expect(value).toStrictEqual(createInitialState())
    })
    store.disposeObservable(observable)
    store.update(createStateA())
  })

  it(`should complete the subscription on update when disposing the query context.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const observable = store.get$()
    const sub = observable.subscribe(() => { })
    expect(sub.closed).toBeFalsy()
    store.disposeObservable(observable)
    store.update(createStateA())
    expect(sub.closed).toBeTruthy()
  })
})
