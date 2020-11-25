import { TestSubjectFactory } from 'factories'
import { Store } from 'lbrx'
import { TestSubject } from 'test-subjects'

describe('Store Is Loading State', () => {

  const initialState = TestSubjectFactory.createTestSubject_initial()
  let store: Store<TestSubject>

  beforeEach(async () => {
    const providerModule = await import('provider')
    store = providerModule.StoresFactory.createStore(initialState)
  })

  afterEach(() => {
    jest.resetModules()
  })

  it("should have false as the default store's loading state.", () => {
    expect(store.isLoading).toBeFalsy()
  })

  it("should have false as the default store's loading state from observable.", done => {
    store.isLoading$.subscribe(value => {
      expect(value).toBeFalsy()
      done()
    })
  })

  it('should have distinct observable values.', async () => {
    const expectedValues = [false, true, false]
    const nextValues = [false, true, true, false, false]
    const actualValues: boolean[] = []
    store.isLoading$.subscribe(value => actualValues.push(value))
    nextValues.forEach(value => store.isLoading = value)
    await Promise.resolve()
    expect(actualValues).toStrictEqual(expectedValues)
  })
})
