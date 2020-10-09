import { getOwnPropertyNames } from 'lbrx/utils'
import { TestSubjectFactory } from '__test__/factories'

describe('Short Hand Function - getOwnPropertyNames():', () => {

  it('should call getOwnPropertyNames on on Object.', () => {
    const getOwnPropertyNamesSpy = jest.spyOn(Object, 'getOwnPropertyNames')
    const testSubject = TestSubjectFactory.createTestSubject_configA()
    getOwnPropertyNames(testSubject)
    expect(getOwnPropertyNamesSpy).toBeCalledTimes(1)
  })

  it("should return object's own property names.", () => {
    const testSubject = TestSubjectFactory.createTestSubject_configA()
    expect(getOwnPropertyNames(testSubject)).toStrictEqual(Object.getOwnPropertyNames(testSubject))
  })
})
