import { DeepNestedTestSubject } from './deep-nested-test-subject.model'
import { ErrorTestSubject } from './error-test-subject'
import { InnerTestSubject } from './inner-test-subject.model'
import { TestSubjectConfigurations } from './test-subject-configurations.enum'
import { TestSubject } from './test-subject.model'

export class TestSubjectsFactory {

  public static createTestSubject_initial(): TestSubject {
    return this.createTestSubject(TestSubjectConfigurations.initial)
  }

  public static createTestSubject_configA(): TestSubject {
    return this.createTestSubject(TestSubjectConfigurations.configurationA)
  }
  public static createTestSubject_configA_plain(): TestSubject {
    return this.createTestSubject(TestSubjectConfigurations.configurationA_plain)
  }
  public static createTestSubject_configB(): TestSubject {
    return this.createTestSubject(TestSubjectConfigurations.configurationB)
  }

  public static createTestSubject(configuration: TestSubjectConfigurations): TestSubject {
    switch (configuration) {
      case TestSubjectConfigurations.initial:
        return new TestSubject({
          stringValue: 'abcdefg',
          numberValue: 5,
          booleanValue: false,
          dateValue: new Date(2020, 5),
          getterSetterDate: new Date(2020, 6),
          innerTestObject: TestSubjectsFactory.createInnerTestSubject(configuration),
          innerTestObjectGetSet: TestSubjectsFactory.createInnerTestSubject(configuration),
        })
      case TestSubjectConfigurations.configurationA:
        return new TestSubject({
          stringValue: 'abcdefg',
          numberValue: 5,
          booleanValue: false,
          dateValue: new Date(2020, 2),
          getterSetterDate: new Date(2020, 6),
          innerTestObject: TestSubjectsFactory.createInnerTestSubject(configuration),
          innerTestObjectGetSet: TestSubjectsFactory.createInnerTestSubject(configuration),
        })
      case TestSubjectConfigurations.configurationA_plain:
        return JSON.parse(JSON.stringify(this.createTestSubject(TestSubjectConfigurations.configurationA)))
      case TestSubjectConfigurations.configurationB:
        return new TestSubject({
          stringValue: 'abcdefg',
          numberValue: 5,
          booleanValue: false,
          dateValue: new Date(2020, 2),
          getterSetterDate: new Date(2020, 6),
          innerTestObject: null,
          innerTestObjectGetSet: null,
        })
    }
  }

  public static createInnerTestSubject(configuration: TestSubjectConfigurations): InnerTestSubject | null {
    switch (configuration) {
      case TestSubjectConfigurations.initial:
        return new InnerTestSubject({
          stringValue: 'a b c',
          numberValue: 112346579.1236549,
          booleanValue: true,
          dateValue: new Date(2018),
          getterSetterDate: new Date(2018, 8),
          deepNestedObj: TestSubjectsFactory.createDeepNestedTestSubject(configuration),
          obj: {
            value: 'aaaaaaaa bbbbbbbbb',
            date: new Date(2017, 5)
          },
        })
      case TestSubjectConfigurations.configurationA:
        return new InnerTestSubject({
          stringValue: 'a b c',
          numberValue: 112346579.1236549,
          booleanValue: true,
          dateValue: new Date(2018, 9),
          getterSetterDate: new Date(2018, 8),
          deepNestedObj: TestSubjectsFactory.createDeepNestedTestSubject(configuration),
          obj: {
            value: 'aaaaaaaa bbbbbbbbb',
            date: new Date(2017, 5)
          },
        })
      case TestSubjectConfigurations.configurationA_plain:
        return JSON.parse(JSON.stringify(this.createInnerTestSubject(TestSubjectConfigurations.configurationA)))
      case TestSubjectConfigurations.configurationB:
        return null
    }
  }

  public static createDeepNestedTestSubject(configuration: TestSubjectConfigurations): DeepNestedTestSubject | null {
    switch (configuration) {
      case TestSubjectConfigurations.initial: {
        const partialDeepNestedObject: Partial<DeepNestedTestSubject> = {
          stringValue: 'some string here',
          numberValue: 5.55,
          booleanValue: false,
          dateValue: new Date(2019, 0),
          objectList: [
            {
              value: 'some value',
              date: new Date(2019, 5)
            },
            {
              value: 'some other value',
              date: new Date(2019, 5)
            },
            null,
            {
              value: 'some value',
              date: new Date(2019, 6)
            },
          ],
          stringsList: [
            'a',
            'b b b',
            'c',
            null,
            'e e'
          ]
        }
        return Object.assign(new DeepNestedTestSubject(), partialDeepNestedObject)
      }
      case TestSubjectConfigurations.configurationA: {
        const partialDeepNestedObject: Partial<DeepNestedTestSubject> = {
          stringValue: 'some string here',
          numberValue: 5.55,
          booleanValue: false,
          dateValue: new Date(2019, 0),
          objectList: [
            {
              value: 'some value',
              date: new Date(2019, 5)
            },
            {
              value: 'some other value',
              date: new Date(2019, 5)
            },
            {
              value: 'some value',
              date: new Date(2019, 9)
            },
            {
              value: 'some value',
              date: new Date(2019, 6)
            },
          ],
          stringsList: [
            'a',
            'b b b',
            'c',
            null,
            'e e'
          ]
        }
        return Object.assign(new DeepNestedTestSubject(), partialDeepNestedObject)
      }
      case TestSubjectConfigurations.configurationA_plain:
        return JSON.parse(JSON.stringify(this.createDeepNestedTestSubject(TestSubjectConfigurations.configurationA)))
      case TestSubjectConfigurations.configurationB:
        return null
    }
  }

  public static createError(text: string = 'Some new error data.'): Error {
    return new Error(text)
  }

  public static createErrorTestSubject(text: string = 'Some error data.'): ErrorTestSubject {
    return new ErrorTestSubject(text)
  }

  public static createNestedError(): ErrorTestSubject {
    let err = new ErrorTestSubject('Layer3 error')
    err = new ErrorTestSubject(err, 'Layer2 error')
    return new ErrorTestSubject(err, 'Layer1 error')
  }
}
