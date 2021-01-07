import { Actions } from 'lbrx'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

describe(`Store - onAction():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  const createStateA = () => TestSubjectFactory.createTestSubject_configA()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should return QueryableStore with get$ only.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const result = store.onAction(`action`)
    expect(typeof result).toBe(`object`)
    expect(typeof result.get$).toBe(`function`)
    expect(Object.keys(result).length).toBe(1)
  })

  it(`should emit the subscriber only on the provided action.`, done => {
    const store = StoresFactory.createStore(createInitialState())
    const actionsName = `myActions`
    expect.assertions(2)
    store.onAction(Actions.set).get$().subscribe(value => {
      expect(value).toStrictEqual(createStateA())
    })
    store.onAction(actionsName).get$().subscribe(value => {
      const expectedState = createStateA()
      expectedState.stringValue = `value value value`
      expect(value).toStrictEqual(expectedState)
      done()
    })
    store.update({ stringValue: `value value value` })
    store.set(createStateA())
    store.update({ stringValue: `value value value` })
    store.update({ stringValue: `value value value` }, actionsName)
  })
})
