import { compareObjects } from 'lbrx/helpers'
import { TestSubject, TestSubjectsFactory, TestSubjectWithMethods } from 'test-subjects'

// tslint:disable: variable-name

describe('Helper Function - compareObjects():', () => {

  let testSubjectConfigA: TestSubject
  let testSubjectConfigA_copy: TestSubject
  let testSubjectConfigA_plain: TestSubject
  let testSubjectConfigB: TestSubject
  let testSubjectConfigB_copy: TestSubject
  let testSubjectWithMethodsConfigA: TestSubjectWithMethods
  let testSubjectWithMethodsConfigA_copy: TestSubjectWithMethods
  let testSubjectWithMethodsConfigA_plain: TestSubjectWithMethods
  let testSubjectWithMethodsConfigB: TestSubjectWithMethods
  let testSubjectWithMethodsConfigB_copy: TestSubjectWithMethods

  beforeEach(() => {
    testSubjectConfigA = TestSubjectsFactory.createTestSubject_configA()
    testSubjectConfigA_copy = TestSubjectsFactory.createTestSubject_configA()
    testSubjectConfigA_plain = TestSubjectsFactory.createTestSubject_configA_plain()
    testSubjectConfigB = TestSubjectsFactory.createTestSubject_configB()
    testSubjectConfigB_copy = TestSubjectsFactory.createTestSubject_configB()
    testSubjectWithMethodsConfigA = TestSubjectsFactory.createTestSubjectWithMethods_configA()
    testSubjectWithMethodsConfigA_copy = TestSubjectsFactory.createTestSubjectWithMethods_configA()
    testSubjectWithMethodsConfigA_plain = TestSubjectsFactory.createTestSubjectWithMethods_configA_plain()
    testSubjectWithMethodsConfigB = TestSubjectsFactory.createTestSubjectWithMethods_configB()
    testSubjectWithMethodsConfigB_copy = TestSubjectsFactory.createTestSubjectWithMethods_configB()
  })

  it('should return that objects are equal.', () => {
    expect(compareObjects(testSubjectConfigA, testSubjectConfigA_copy)).toBeTruthy()
    expect(compareObjects(testSubjectConfigB, testSubjectConfigB_copy)).toBeTruthy()
    expect(compareObjects(testSubjectWithMethodsConfigA, testSubjectWithMethodsConfigA_copy)).toBeTruthy()
    expect(compareObjects(testSubjectWithMethodsConfigB, testSubjectWithMethodsConfigB_copy)).toBeTruthy()
  })

  it('should return that objects are not equal.', () => {
    expect(compareObjects(testSubjectConfigA, testSubjectConfigA_plain)).toBeFalsy()
    expect(compareObjects(testSubjectConfigA, testSubjectConfigB)).toBeFalsy()
    expect(compareObjects(testSubjectWithMethodsConfigA, testSubjectWithMethodsConfigA_plain)).toBeFalsy()
    expect(compareObjects(testSubjectWithMethodsConfigA, testSubjectWithMethodsConfigB)).toBeFalsy()
  })
})
