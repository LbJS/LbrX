
import { sleep } from 'helpers/functions'
import { InnerTestSubject, Store, TestSubject, TestSubjectFactory } from 'provider'

describe('Store select$():', () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  const createStateB = () => TestSubjectFactory.createTestSubject_configB()
  const customObjA = () => Object.assign(createStateA(), { stringValue: 'new string 1' } as TestSubject)
  const customObjB = () => Object.assign(createStateA(),
    { innerTestObject: Object.assign(createStateA().innerTestObject, { numberValue: 777 } as InnerTestSubject) } as TestSubject)
  let store: Store<TestSubject>

  beforeEach(async () => {
    const provider = await import('provider')
    store = provider.StoresFactory.createStore<TestSubject>(createInitialState())
  })


  it("should return store's state on subscribe.", done => {
    expect.assertions(1)
    store.select$().subscribe(state => {
      expect(state).toStrictEqual(createInitialState())
      done()
    })
  })

  it("should return store's state when it's updated.", async done => {
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

  it("should return store's state when it's updated but only when it changes.", async done => {
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

  it('should return the selected property based on the provided projection method.', done => {
    expect.assertions(1)
    store.select$(state => state.stringValue).subscribe(value => {
      expect(value).toStrictEqual(createInitialState().stringValue)
      done()
    })
  })

  it('should return the selected property based on the provided projection method only when it changes.', async done => {
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
})
