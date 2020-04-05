import { Store } from 'lbrx'
import { TestSubjectA, TestSubjectsFactory } from 'test-subjects'
import { StoreBeforeInit } from 'lbrx/hooks'

describe('Store onBeforeInit():', () => {

	const initialState = TestSubjectsFactory.createTestSubjectA_initial()
	let store: Store<TestSubjectA> & StoreBeforeInit<TestSubjectA>
	let onBeforeInitSpy: jest.SpyInstance<void | TestSubjectA, [TestSubjectA]>

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		store = providerModule.StoresFactory.createTestStore<TestSubjectA>(null)
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
})
