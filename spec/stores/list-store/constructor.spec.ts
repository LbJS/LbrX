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

  it(`should allow setting the idKey to null.`, () => {
    const store = StoresFactory.createListStore(null, { name: 'TEST-STORE', idKey: null })
    expect(store.config.idKey).toBeNull()
  })

  it(`should insert items into the map if idKey is null.`, () => {
    const store = StoresFactory.createListStore(createTestSubjects(), { name: 'TEST-STORE', idKey: null })
    expect(store[`_map`].size).toBe(0)
  })

  it(`should throw if a duplicate id is found.`, () => {
    const data = [...createTestSubjects(), ...createTestSubjects()]
    expect(() => {
      StoresFactory.createListStore(data)
    }).toThrow()
  })

  it(`should allow setting the idKey value to be a number or a string.`, () => {
    let data = createTestSubjects()
    let id = 0
    data.forEach(x => x._id = ++id)
    expect(() => {
      StoresFactory.createListStore(data, { name: 'TEST-STORE1' })
    }).not.toThrow()
    data = createTestSubjects()
    id = 0
    data.forEach(x => x._id = (++id).toString())
    expect(() => {
      StoresFactory.createListStore(data, { name: 'TEST-STORE2' })
    }).not.toThrow()
  })

  it(`should throw if the provided key is not an string or a number.`, () => {
    let data = createTestSubjects()
    data.forEach(x => x._id = {})
    expect(() => {
      StoresFactory.createListStore(data, { name: 'TEST-STORE1' })
    }).toThrow()
    data = createTestSubjects()
    data.forEach(x => x._id = Symbol())
    expect(() => {
      StoresFactory.createListStore(data, { name: 'TEST-STORE2' })
    }).toThrow()
  })
})
