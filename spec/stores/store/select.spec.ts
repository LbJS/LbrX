import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'
import { TestSubject } from '__test__/test-subjects'

describe(`Store - select():`, () => {

  const createInitialState = () => TestSubjectFactory.createTestSubject_initial()
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })


  it(`should return store's state value.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const result = store.select()
    expect(result).toStrictEqual(createInitialState())
  })

  it(`should return the selected property based on the provided projection method.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const result = store.select(state => state.stringValue)
    expect(result).toStrictEqual(createInitialState().stringValue)
  })

  it(`should emit the selected nested property based on the provided projection method.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const result = store.select(state => state.innerTestObject!.deepNestedObj!.objectList)
    expect(result).toStrictEqual(createInitialState().innerTestObject!.deepNestedObj!.objectList)
  })

  it(`should allow casting to newly defined object.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const expectedResult = {
      s: createInitialState().stringValue,
      n: createInitialState().numberValue,
    }
    const result = store.select(state => ({
      s: state.stringValue,
      n: state.numberValue,
    }))
    expect(result).toStrictEqual(expectedResult)
  })

  it(`should emit a value based on an array of projection methods.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const initialState = createInitialState()
    const expectedResult = [initialState.dateValue, initialState.innerTestObject]
    const result = store.select([
      value => value.dateValue,
      value => value.innerTestObject
    ])
    expect(result).toStrictEqual(expectedResult)
  })

  it(`should emit a value based on a key value.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const result = store.select(`stringValue`)
    expect(result).toStrictEqual(createInitialState().stringValue)
  })

  it(`should emit a value based on an array of key values.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const initialState = createInitialState()
    const expectedResult: Partial<TestSubject> = {
      stringValue: initialState.stringValue,
      numberValue: initialState.numberValue,
      dateValue: initialState.dateValue,
    }
    const result = store.select([`stringValue`, `numberValue`, `dateValue`])
    expect(result).toStrictEqual(expectedResult)
  })

  it(`should throw if the method is called before initialization.`, () => {
    const store = StoresFactory.createStore(null)
    expect(() => {
      store.select()
    }).toThrow()
  })

  it(`it should emit the whole value if the provided paramter is invalid array.`, () => {
    const store = StoresFactory.createStore(createInitialState())
    const result1 = store.select([])
    expect(result1).toStrictEqual(createInitialState())
    const result2 = store.select([`stringValue`, (value: any) => value.stringValue] as any)
    expect(result2).toStrictEqual(createInitialState())
  })
})
