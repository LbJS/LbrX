import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { performance } from 'perf_hooks'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

jest.retryTimes(5)
describe(`List Store - constructor():`, () => {

  const createTestSubjects = (amount?: number) => TestSubjectFactory.createTestSubject_list_initial(amount)
  let StoresFactory: typeof StoresFactory_type
  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    LbrXManager = provider.LbrXManager
    LbrXManager.enableProdMode()
  })

  it(`should initialize in under 35 ms with 100 items.`, () => {
    const data = createTestSubjects()
    const startTime = performance.now()
    StoresFactory.createListStore(data)
    const endTime = performance.now()
    // console.log(endTime - startTime)
    expect(endTime - startTime).toBeLessThanOrEqual(35)
  })
})
