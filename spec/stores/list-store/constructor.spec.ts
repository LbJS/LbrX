import { LbrXManager as LbrXManager_type } from 'lbrx/core'
import { StoresFactory as StoresFactory_type, TestSubjectFactory } from '__test__/factories'

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

  it(`should allow setting the id to null.`, () => {
    const store = StoresFactory.createListStore(null, { name: 'TEST-STORE', id: null })
    expect(store.config.id).toBeNull()
  })

  it(`should throw if a duplicate id is found.`, () => {
    const data = [...createTestSubjects(), ...createTestSubjects()]
    expect(() => {
      StoresFactory.createListStore(data, { name: 'TEST-STORE' })
    }).toThrow()
  })
})
