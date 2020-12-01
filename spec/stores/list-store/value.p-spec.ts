import { performance } from 'perf_hooks'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

jest.retryTimes(5)
describe(`List Store - constructor():`, () => {

  const createTestSubjects = (amount?: number) => TestSubjectFactory.createTestSubject_list_initial(amount)
  let StoresFactory: typeof StoresFactory_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
  })

  it(`should return the value in under 100 ms with 100 items.`, () => {
    const data = createTestSubjects()
    const store = StoresFactory.createListStore(data)
    const startTime = performance.now()
    // tslint:disable-next-line: no-unused-expression
    store.value
    const endTime = performance.now()
    expect(endTime - startTime).toBeLessThanOrEqual(100)
  })
})
