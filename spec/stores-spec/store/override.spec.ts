import { Store as Store_type, StoreConfig } from 'lbrx'
import { TestSubjectConfigurations, TestSubjectA, TestSubjectsFactory, InnerTestSubjectA, DeepNestedTestSubjectA } from 'test-subjects'

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

	it('should get the expected steam of states.', done => {
		const initialState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.initial)
		const stateA = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
		const stateB = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationB)
		const expectedStates = [
			initialState,
			stateB,
			stateA,
			stateB,
			initialState,
		]
		let index = 0
		testStore.select().subscribe(value => {
			expect(value).toStrictEqual(expectedStates[index++])
			if (index == expectedStates.length) done()
		})
		testStore.override(stateB)
		testStore.override(stateA)
		testStore.override(stateB)
		testStore.override(initialState)
	}, 100)

	it('should disconnect object reference.', () => {
		const newState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
		testStore.override(newState)
		expect(testStore.value).not.toBe(newState)
		expect(testStore.value).toStrictEqual(newState)
		expect(newState.dateValue).toBeTruthy()
		newState.dateValue?.setFullYear(1900)
		expect(newState.dateValue?.getFullYear()).toBe(1900)
		const expectedState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
		expect(testStore.value).toStrictEqual(expectedState)
	})

	it('should handle instances for plain object.', () => {
		const newState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
		testStore.override(newState)
		expect(testStore.value).not.toBe(newState)
		expect(testStore.value).toStrictEqual(newState)
		expect(newState.dateValue).toBeTruthy()
		newState.dateValue?.setFullYear(1900)
		expect(newState.dateValue?.getFullYear()).toBe(1900)
		const expectedState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
		expect(testStore.value).toStrictEqual(expectedState)
	})

	it('should set object instances for plain object.', () => {
		const newState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA)
		testStore.override(newState)
		expect(testStore.value).toStrictEqual(newState)
		const plainNewState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.configurationA_plain)
		testStore.override(plainNewState)
		expect(testStore.value).toStrictEqual(newState)
		expect(testStore.value).toBeInstanceOf(TestSubjectA)
		expect(testStore.value.innerTestObject).toBeInstanceOf(InnerTestSubjectA)
		expect(testStore.value.innerTestObject?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubjectA)
		expect(testStore.value.innerTestObjectGetSet).toBeInstanceOf(InnerTestSubjectA)
		expect(testStore.value.innerTestObjectGetSet?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubjectA)
	})

	// TODO: hooks test
})
