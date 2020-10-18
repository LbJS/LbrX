import { isObjectCloned } from 'lbrx/utils'
import { TestSubjectFactory } from '__test__/factories'
import { objectAssign } from '__test__/functions'

// tslint:disable: variable-name
describe(`Helper Function - isObjectCloned():`, () => {

  const createStateConfigA = () => TestSubjectFactory.createTestSubject_configA()
  const createStateConfigA_plain = () => TestSubjectFactory.createTestSubject_configA_plain()
  const createStateConfigB = () => TestSubjectFactory.createTestSubject_configB()
  const createStateWithMethodsConfigA = () => TestSubjectFactory.createTestSubjectWithMethods_configA()
  const createStateWithMethodsConfigA_plain = () => TestSubjectFactory.createTestSubjectWithMethods_configA_plain()
  const createStateWithMethodsConfigB = () => TestSubjectFactory.createTestSubjectWithMethods_configB()

  it(`should return that objects are cloned.`, () => {
    expect(isObjectCloned(createStateConfigA(), createStateConfigA())).toBeTruthy()
    expect(isObjectCloned(createStateConfigA_plain(), createStateConfigA_plain())).toBeTruthy()
    expect(isObjectCloned(createStateConfigB(), createStateConfigB())).toBeTruthy()
    expect(isObjectCloned(createStateWithMethodsConfigA(), createStateWithMethodsConfigA())).toBeTruthy()
    expect(isObjectCloned(createStateWithMethodsConfigA_plain(), createStateWithMethodsConfigA_plain())).toBeTruthy()
    expect(isObjectCloned(createStateWithMethodsConfigB(), createStateWithMethodsConfigB())).toBeTruthy()
  })

  it(`should return that objects are not cloned.`, () => {
    let obj = createStateConfigA()
    expect(isObjectCloned(obj, objectAssign({}, obj))).toBeFalsy()
    obj = createStateConfigA_plain()
    expect(isObjectCloned(obj, objectAssign({}, obj))).toBeFalsy()
    obj = createStateConfigB()
    expect(isObjectCloned(obj, objectAssign({}, obj))).toBeFalsy()
    obj = createStateWithMethodsConfigA()
    expect(isObjectCloned(obj, objectAssign({}, obj))).toBeFalsy()
    obj = createStateWithMethodsConfigA_plain()
    expect(isObjectCloned(obj, objectAssign({}, obj))).toBeFalsy()
    obj = createStateWithMethodsConfigB()
    expect(isObjectCloned(obj, objectAssign({}, obj))).toBeFalsy()
  })
})
