import { Store as Store_type, StoreConfig } from 'lbrx'
import { TestSubjectConfigurations, TestSubjectA, TestSubjectsFactory } from 'test-subjects'

describe('Store override:', () => {

	let Store: typeof Store_type
	let testStore: Store_type<TestSubjectA>

	beforeEach(async () => {
		const provider = (await import('provider')).default
		Store = provider.provide(Store_type.name)
		@StoreConfig({
			name: 'TEST-STORE'
		})
		class TestStore extends Store<TestSubjectA> {
			constructor() {
				super(TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.initial))
			}
		}
		testStore = new TestStore()
	})

	afterEach(() => {
		jest.resetModules()
	})

	it("should override the store's state value.", () => {
		let expectedValue = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.initial)
		expect(testStore.value).toStrictEqual(expectedValue)
		const newValue = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
		testStore.override(newValue)
		expectedValue = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
		expect(testStore.value).toStrictEqual(expectedValue)
	})
})
