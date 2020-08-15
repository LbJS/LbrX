import { TestSubjectFactory } from 'helpers/factories'
import { TestSubject } from 'helpers/test-subjects'
import { Store } from 'lbrx'

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
    nextValues.forEach(value => (store as any)._setState({ isLoading: value }))
    await Promise.resolve()
    expect(actualValues).toStrictEqual(expectedValues)
  })
})
