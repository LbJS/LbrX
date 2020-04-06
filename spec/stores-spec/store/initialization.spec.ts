import { TestSubjectA, TestSubjectsFactory } from 'test-subjects'
import { LbrXManager as LbrXManager_type, Store } from 'lbrx'

describe('Store Initialization: ', () => {

	const initialState = TestSubjectsFactory.createTestSubjectA_initial()
	const pureInitialState = TestSubjectsFactory.createTestSubjectA_initial()
	const stateA = TestSubjectsFactory.createTestSubjectA_configA()
	let store: Store<TestSubjectA>
	let loadingStore: Store<TestSubjectA>
	let LbrXManager: typeof LbrXManager_type
	let isDev: () => boolean

	beforeEach(async () => {
		const providerModule = await import('provider.module')
		store = providerModule.StoresFactory.createStore(initialState)
		loadingStore = providerModule.StoresFactory.createStore<TestSubjectA>(null, 'LOADING-STORE')
		LbrXManager = providerModule.LbrXManager
		isDev = providerModule.isDev
	})

	afterEach(() => {
		jest.resetModules()
	})

	it('should set the initial value as the first state.', () => {
		expect(store.value).toStrictEqual(pureInitialState)
	})

	it("should set the initial value to store's initial value property.", () => {
		expect(store.value).toStrictEqual(store.initialValue)
	})

	it('should return the initial state from observable.', done => {
		store.select$().subscribe(value => {
			expect(value).toStrictEqual(pureInitialState)
			done()
		})
	}, 100)

	it('should have null as an initial value.', () => {
		expect(loadingStore.value).toBeNull()
	})

	it('should set the initial value after initialization.', () => {
		loadingStore.initialize(initialState)
		expect(loadingStore.value).toStrictEqual(pureInitialState)
	})

	it('should return the initial state from observable after initialization.', done => {
		loadingStore.select$().subscribe(value => {
			expect(value).toStrictEqual(pureInitialState)
			done()
		})
		loadingStore.initialize(initialState)
	}, 100)

	it('should throw an error on second initialization in development mode.', () => {
		loadingStore.initialize(initialState)
		expect(isDev()).toBeTruthy()
		expect(() => {
			loadingStore.initialize(initialState)
		}).toThrow()
	})

	it('should not throw an error on second initialization in production mode.', () => {
		LbrXManager.enableProdMode()
		loadingStore.initialize(initialState)
		expect(() => {
			loadingStore.initialize(initialState)
		}).not.toThrow()
	})

	it('should not contain second initialization value in production mode.', () => {
		LbrXManager.enableProdMode()
		loadingStore.initialize(initialState)
		loadingStore.initialize(stateA)
		expect(loadingStore.value).toStrictEqual(pureInitialState)
	})

	it('should have value after loading is finished.', done => {
		loadingStore.isLoading$.subscribe(value => {
			if (!value) {
				expect(loadingStore.value).toStrictEqual(pureInitialState)
				done()
			}
		})
		loadingStore.initialize(initialState)
	}, 100)
})
