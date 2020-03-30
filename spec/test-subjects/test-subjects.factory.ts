import { TestSubjectA } from './test-subject-a.model'
import { InnerTestSubjectA } from './inner-test-subject-a.model'
import { DeepNestedTestSubjectA } from './deep-nested-test-subject-a.model'

export class TestSubjectsFactory {
	public static createInitialTestSubjectA(): TestSubjectA {
		return new TestSubjectA({
			stringValue: 'abcdefg',
			numberValue: 5,
			booleanValue: false,
			dateValue: new Date(2020, 5),
			getterSetterDate: new Date(2020, 6),
			innerTestObject: TestSubjectsFactory.createInnerTestSubjectA(),
			innerTestObjectGetSet: TestSubjectsFactory.createInnerTestSubjectA(),
		})
	}

	public static createInnerTestSubjectA(): InnerTestSubjectA {
		return new InnerTestSubjectA({
			stringValue: 'a b c',
			numberValue: 112346579.1236549,
			booleanValue: true,
			dateValue: new Date(2018, 9),
			getterSetterDate: new Date(2018, 8),
			deepNestedObj: TestSubjectsFactory.createDeepNestedTestSubjectA(),
			obj: {
				value: 'aaaaaaaa bbbbbbbbb',
				date: new Date(2017, 5)
			},
		})
	}

	public static createDeepNestedTestSubjectA(): DeepNestedTestSubjectA {
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
}
