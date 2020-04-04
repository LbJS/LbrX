import { TestSubjectA } from './test-subject-a.model'
import { InnerTestSubjectA } from './inner-test-subject-a.model'
import { DeepNestedTestSubjectA } from './deep-nested-test-subject-a.model'
import { TestSubjectConfigurations } from './test-subject-configurations.enum'

export class TestSubjectsFactory {

	public static createTestSubjectA(configuration: TestSubjectConfigurations): TestSubjectA {
		switch (configuration) {
			case TestSubjectConfigurations.initial:
				return new TestSubjectA({
					stringValue: 'abcdefg',
					numberValue: 5,
					booleanValue: false,
					dateValue: new Date(2020, 5),
					getterSetterDate: new Date(2020, 6),
					innerTestObject: TestSubjectsFactory.createInnerTestSubjectA(configuration),
					innerTestObjectGetSet: TestSubjectsFactory.createInnerTestSubjectA(configuration),
				})
			case TestSubjectConfigurations.configurationA:
				return new TestSubjectA({
					stringValue: 'abcdefg',
					numberValue: 5,
					booleanValue: false,
					dateValue: new Date(2020, 2),
					getterSetterDate: new Date(2020, 6),
					innerTestObject: TestSubjectsFactory.createInnerTestSubjectA(configuration),
					innerTestObjectGetSet: TestSubjectsFactory.createInnerTestSubjectA(configuration),
				})
			case TestSubjectConfigurations.configurationA_plain:
				return {
					stringValue: 'abcdefg',
					numberValue: 5,
					booleanValue: false,
					dateValue: '2020-02-29T22:00:00.000Z' as unknown as Date,
					getterSetterDate: '2020-06-30T21:00:00.000Z' as unknown as Date,
					innerTestObject: TestSubjectsFactory.createInnerTestSubjectA(configuration),
					innerTestObjectGetSet: TestSubjectsFactory.createInnerTestSubjectA(configuration),
				} as TestSubjectA
			case TestSubjectConfigurations.configurationB:
				return new TestSubjectA({
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

	public static createInnerTestSubjectA(configuration: TestSubjectConfigurations): InnerTestSubjectA | null {
		switch (configuration) {
			case TestSubjectConfigurations.initial:
				return new InnerTestSubjectA({
					stringValue: 'a b c',
					numberValue: 112346579.1236549,
					booleanValue: true,
					dateValue: new Date(2018),
					getterSetterDate: new Date(2018, 8),
					deepNestedObj: TestSubjectsFactory.createDeepNestedTestSubjectA(configuration),
					obj: {
						value: 'aaaaaaaa bbbbbbbbb',
						date: new Date(2017, 5)
					},
				})
			case TestSubjectConfigurations.configurationA:
				return new InnerTestSubjectA({
					stringValue: 'a b c',
					numberValue: 112346579.1236549,
					booleanValue: true,
					dateValue: new Date(2018, 9),
					getterSetterDate: new Date(2018, 8),
					deepNestedObj: TestSubjectsFactory.createDeepNestedTestSubjectA(configuration),
					obj: {
						value: 'aaaaaaaa bbbbbbbbb',
						date: new Date(2017, 5)
					},
				})
			case TestSubjectConfigurations.configurationA_plain:
				return {
					stringValue: 'a b c',
					numberValue: 112346579.1236549,
					booleanValue: true,
					dateValue: '2018-09-30T21:00:00.000Z' as unknown as Date,
					getterSetterDate: '2018-08-31T21:00:00.000Z' as unknown as Date,
					deepNestedObj: TestSubjectsFactory.createDeepNestedTestSubjectA(configuration),
					obj: {
						value: 'aaaaaaaa bbbbbbbbb',
						date: '2017-05-31T21:00:00.000Z' as unknown as Date
					},
				} as InnerTestSubjectA
			case TestSubjectConfigurations.configurationB:
				return null
		}
	}

	public static createDeepNestedTestSubjectA(configuration: TestSubjectConfigurations): DeepNestedTestSubjectA | null {
		switch (configuration) {
			case TestSubjectConfigurations.initial: {
				const partialDeepNestedObject: Partial<DeepNestedTestSubjectA> = {
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
					stringList: [
						'a',
						'b b b',
						'c',
						null,
						'e e'
					]
				}
				return Object.assign(new DeepNestedTestSubjectA(), partialDeepNestedObject)
			}
			case TestSubjectConfigurations.configurationA: {
				const partialDeepNestedObject: Partial<DeepNestedTestSubjectA> = {
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
					stringList: [
						'a',
						'b b b',
						'c',
						null,
						'e e'
					]
				}
				return Object.assign(new DeepNestedTestSubjectA(), partialDeepNestedObject)
			}
			case TestSubjectConfigurations.configurationA_plain:
				return {
					stringValue: 'some string here',
					numberValue: 5.55,
					booleanValue: false,
					dateValue: '2018-12-31T22:00:00.000Z' as unknown as Date,
					objectList: [
						{
							value: 'some value',
							date: '2019-05-31T21:00:00.000Z' as unknown as Date
						},
						{
							value: 'some other value',
							date: '2019-05-31T21:00:00.000Z' as unknown as Date
						},
						{
							value: 'some value',
							date: '2019-09-30T21:00:00.000Z' as unknown as Date
						},
						{
							value: 'some value',
							date: '2019-06-30T21:00:00.000Z' as unknown as Date
						},
					],
					stringList: [
						'a',
						'b b b',
						'c',
						null,
						'e e'
					]
				}
			case TestSubjectConfigurations.configurationB:
				return null
		}
	}
}
