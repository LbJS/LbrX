import { Store } from 'lbrx'
import { TestSubjectA, TestSubjectsFactory, InnerTestSubjectA, DeepNestedTestSubjectA } from 'test-subjects'
import { assertNotNullable, assertEqual } from 'helpers'

describe('Store override():', () => {

	const initialState = TestSubjectsFactory.createTestSubjectA_initial()
	const createStateA = () => TestSubjectsFactory.createTestSubjectA_configA()
	const stateA = createStateA()
	const stateB = TestSubjectsFactory.createTestSubjectA_configB()
	let store: Store<TestSubjectA>

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		store = providerModule.StoresFactory.createTestStore<TestSubjectA>(initialState)
	})

	afterEach(() => {
		jest.resetModules()
	})

	it("should override the store's state value.", () => {
		expect(store.value).toStrictEqual(initialState)
		const localStateA = createStateA()
		store.override(localStateA)
		const expectedState = createStateA()
		expect(store.value).toStrictEqual(expectedState)
	})

	it('should get the expected steam of states.', done => {
		const expectedStates = [
			initialState,
			stateB,
			stateA,
			stateB,
			initialState,
		]
		let index = 0
		store.select$().subscribe(value => {
			expect(value).toStrictEqual(expectedStates[index++])
			if (index == expectedStates.length) done()
		})
		store.override(stateB)
		store.override(stateA)
		store.override(stateB)
		store.override(initialState)
	}, 100)

	it('should disconnect object reference.', () => {
		const localStateA = createStateA()
		store.override(localStateA)
		expect(store.value).not.toBe(localStateA)
		expect(store.value).toStrictEqual(localStateA)
		assertNotNullable(localStateA.dateValue)
		localStateA.dateValue.setFullYear(1900)
		assertEqual(localStateA.dateValue.getFullYear(), 1900)
		const expectedState = createStateA()
		expect(store.value).toStrictEqual(expectedState)
	})

	it('should handle instances for plain object.', () => {
		store.override(stateA)
		expect(store.value).toStrictEqual(stateA)
		const plainStateA = TestSubjectsFactory.createTestSubjectA_configA_plain()
		store.override(plainStateA)
		expect(store.value).toStrictEqual(stateA)
		expect(store.value).toBeInstanceOf(TestSubjectA)
		expect(store.value.innerTestObject).toBeInstanceOf(InnerTestSubjectA)
		expect(store.value.innerTestObject?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubjectA)
		expect(store.value.innerTestObjectGetSet).toBeInstanceOf(InnerTestSubjectA)
		expect(store.value.innerTestObjectGetSet?.deepNestedObj).toBeInstanceOf(DeepNestedTestSubjectA)
	})
})
