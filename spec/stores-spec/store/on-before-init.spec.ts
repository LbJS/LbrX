import { Store as Store_type, StoreConfig } from 'lbrx'
import { TestSubjectConfigurations, TestSubjectA, TestSubjectsFactory, InnerTestSubjectA, DeepNestedTestSubjectA } from 'test-subjects'
import { StoreBeforeInit } from 'lbrx/hooks'

describe('Store onBeforeInit():', () => {

	const initialState = TestSubjectsFactory.createTestSubjectA(TestSubjectConfigurations.initial)
	let Store: typeof Store_type
	let store: Store_type<TestSubjectA> & StoreBeforeInit<TestSubjectA>

	beforeEach(async () => {
		Store = (await import('provider.module')).Store
		@StoreConfig({
			name: 'TEST-STORE'
		})
		class TestStore extends Store<TestSubjectA> implements StoreBeforeInit {
			constructor() {
				super(null)
			}
			onBeforeInit(nextState: TestSubjectA): TestSubjectA | void { }
		}
		store = new TestStore()
	})

	afterEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
	})

	it('should be called after initialization if implemented.', () => {
		const onBeforeInitSpy = jest.spyOn(store, 'onBeforeInit')
		store.initialize(initialState)
		expect(onBeforeInitSpy).toBeCalled()
	})

	it('should not be called after initialization if not implemented.', () => {
		const onBeforeInitSpy = jest.spyOn(store, 'onBeforeInit')
		delete store.onBeforeInit
		store.initialize(initialState)
		expect(onBeforeInitSpy).not.toBeCalled()
	})

	it('should be called after async initialization if implemented.', async () => {
		const onBeforeInitSpy = jest.spyOn(store, 'onBeforeInit')
		store.initializeAsync(Promise.resolve(initialState))
		await Promise.resolve()
		expect(store.value).toBeTruthy()
		expect(onBeforeInitSpy).toBeCalled()
	})

	it('should not be called after async initialization if not implemented.', async () => {
		const onBeforeInitSpy = jest.spyOn(store, 'onBeforeInit')
		delete store.onBeforeInit
		store.initializeAsync(Promise.resolve(initialState))
		await Promise.resolve()
		expect(store.value).toBeTruthy()
		expect(onBeforeInitSpy).not.toBeCalled()
	})

	it('should get the nextState as an argument.', done => {
		jest.spyOn(store, 'onBeforeInit')
			.mockImplementation((nextState: TestSubjectA): void => {
				expect(nextState).toStrictEqual(initialState)
				done()
			})
		store.initialize(initialState)
	})
})
