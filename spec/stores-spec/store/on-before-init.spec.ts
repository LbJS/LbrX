import { Store } from 'lbrx'
import { TestSubjectA, TestSubjectsFactory, StoresFactory as StoresFactory_type } from 'test-subjects'
import { StoreBeforeInit } from 'lbrx/hooks'
import { assertNotNullable } from 'helpers'

describe('Store onBeforeInit():', () => {

	const createInitialState = () => TestSubjectsFactory.createTestSubjectA_initial()
	const initialState = createInitialState()
	let StoresFactory: typeof StoresFactory_type
	let store: Store<TestSubjectA> & StoreBeforeInit<TestSubjectA>
	let onBeforeInitSpy: jest.SpyInstance<void | TestSubjectA, [TestSubjectA]>

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		StoresFactory = providerModule.StoresFactory
		store = StoresFactory.createStore<TestSubjectA>(null, true/*with hooks*/)
		onBeforeInitSpy = jest.spyOn(store, 'onBeforeInit')
	})

	afterEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
	})

	it('should be called after initialization if implemented.', () => {
		store.initialize(initialState)
		expect(onBeforeInitSpy).toBeCalled()
	})

	it('should not be called after initialization if not implemented.', () => {
		delete store.onBeforeInit
		store.initialize(initialState)
		expect(onBeforeInitSpy).not.toBeCalled()
	})

	it('should be called after async initialization if implemented.', async () => {
		store.initializeAsync(Promise.resolve(initialState))
		await Promise.resolve()
		expect(store.value).toBeTruthy()
		expect(onBeforeInitSpy).toBeCalled()
	})

	it('should not be called after async initialization if not implemented.', async () => {
		delete store.onBeforeInit
		store.initializeAsync(Promise.resolve(initialState))
		await Promise.resolve()
		expect(store.value).toBeTruthy()
		expect(onBeforeInitSpy).not.toBeCalled()
	})

	it('should get the nextState as an argument.', done => {
		onBeforeInitSpy.mockImplementation((nextState: TestSubjectA): void => {
			expect(nextState).toStrictEqual(initialState)
			done()
		})
		store.initialize(initialState)
	})

	it('should allow changing the next state.', () => {
		const localInitialState = createInitialState()
		onBeforeInitSpy.mockImplementation((nextState: TestSubjectA): TestSubjectA => {
			assertNotNullable(nextState.innerTestObjectGetSet)
			nextState.innerTestObjectGetSet.booleanValue = !nextState.innerTestObjectGetSet.booleanValue
			return nextState
		})
		store.initialize(localInitialState)
		assertNotNullable(localInitialState.innerTestObjectGetSet)
		localInitialState.innerTestObjectGetSet.booleanValue = !localInitialState.innerTestObjectGetSet.booleanValue
		expect(store.value).toStrictEqual(localInitialState)
	})

	it("should disconnect nextState object's references.", async () => {
		onBeforeInitSpy.mockImplementation((nextState: TestSubjectA): void => {
			assertNotNullable(nextState.innerTestObject)
			assertNotNullable(nextState.innerTestObject.obj)
			nextState.innerTestObject.obj.date.setFullYear(1900)
			assertNotNullable(nextState.innerTestObjectGetSet)
			nextState.innerTestObjectGetSet.numberValue = 777
		})
		store.initializeAsync(Promise.resolve(initialState))
		await Promise.resolve()
		expect(store.value).toStrictEqual(initialState)
		jest.resetAllMocks()
		store = StoresFactory.createStore<TestSubjectA>(null, 'ANOTHER-TEST-STORE', true/*with hooks*/)
		onBeforeInitSpy = jest.spyOn(store, 'onBeforeInit')
		let tmpState: TestSubjectA | null = null
		onBeforeInitSpy.mockImplementation((nextState: TestSubjectA): TestSubjectA => {
			tmpState = nextState
			return nextState
		})
		store.initializeAsync(Promise.resolve(initialState))
		await Promise.resolve()
		assertNotNullable(tmpState!)
		assertNotNullable(tmpState!.innerTestObject)
		assertNotNullable(tmpState!.innerTestObject.obj)
		tmpState!.innerTestObject.obj.date.setFullYear(1900)
		assertNotNullable(tmpState!.innerTestObjectGetSet)
		tmpState!.innerTestObjectGetSet.numberValue = 777
		expect(store.value).toStrictEqual(initialState)
	})
})
