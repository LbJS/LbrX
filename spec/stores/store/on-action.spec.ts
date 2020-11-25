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

  it(`should return QueryableStore with select$ only.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const result = store.onAction(`action`)
    expect(typeof result).toBe(`object`)
    expect(typeof result.select$).toBe(`function`)
    expect(Object.keys(result).length).toBe(1)
  })

  it(`should emit the subscriber only on the provided action.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const actionsName = `myActions`
    expect.assertions(2)
    store.onAction(Actions.override).select$().subscribe(value => {
      expect(value).toStrictEqual(createStateA())
    })
    store.onAction(actionsName).select$().subscribe(value => {
      const expectedState = createStateA()
      expectedState.stringValue = `value value value`
      expect(value).toStrictEqual(expectedState)
    })
    store.update({ stringValue: `value value value` })
    store.override(createStateA())
    store.update({ stringValue: `value value value` })
    store.update({ stringValue: `value value value` }, actionsName)
  })
})
