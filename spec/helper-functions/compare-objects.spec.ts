import { TestSubjectFactory } from 'helpers/factories'
import { TestSubject, TestSubjectWithMethods } from 'helpers/test-subjects'
import { compareObjects } from 'lbrx/helpers'

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
    testSubjectConfigA = TestSubjectFactory.createTestSubject_configA()
    testSubjectConfigA_copy = TestSubjectFactory.createTestSubject_configA()
    testSubjectConfigA_plain = TestSubjectFactory.createTestSubject_configA_plain()
    testSubjectConfigB = TestSubjectFactory.createTestSubject_configB()
    testSubjectConfigB_copy = TestSubjectFactory.createTestSubject_configB()
    testSubjectWithMethodsConfigA = TestSubjectFactory.createTestSubjectWithMethods_configA()
    testSubjectWithMethodsConfigA_copy = TestSubjectFactory.createTestSubjectWithMethods_configA()
    testSubjectWithMethodsConfigA_plain = TestSubjectFactory.createTestSubjectWithMethods_configA_plain()
    testSubjectWithMethodsConfigB = TestSubjectFactory.createTestSubjectWithMethods_configB()
    testSubjectWithMethodsConfigB_copy = TestSubjectFactory.createTestSubjectWithMethods_configB()
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
