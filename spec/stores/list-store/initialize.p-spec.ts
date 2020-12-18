import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

jest.retryTimes(5)
describe(`List Store - initialize():`, () => {

  const createTestSubjects = (amount?: number) => TestSubjectFactory.createTestSubject_list_initial(amount)
  let StoresFactory: typeof StoresFactory_type
  let LbrXManager: typeof LbrXManager_type

  beforeEach(async () => {
    const provider = await import(`provider`)
    StoresFactory = provider.StoresFactory
    LbrXManager = provider.LbrXManager
    LbrXManager.enableProdMode()
  })

  it(`should initialize in under 25ms with 100 items.`, () => {
    const data = createTestSubjects()
    const store = StoresFactory.createListStore(null, { name: `TEST-STORE`, id: `id` })
    expect(() => {
      store.initialize(data)
    }).toFinishWithin(25)
  })
})
